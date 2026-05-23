import { ApiError, badRequest } from "../utils/apiError.js";
import { resolveDestinationCoordinates } from "./destinationService.js";
import { getOsrmRoute } from "./osrmClient.js";

const SUPPORTED_PROFILES = new Set(["driving", "walking", "cycling"]);

function hasCoordinateWaypoint(waypoint) {
  return Number.isFinite(Number(waypoint?.latitude))
    && Number.isFinite(Number(waypoint?.longitude));
}

async function normalizeWaypoint(waypoint) {
  if (waypoint?.type === "destination" || waypoint?.id) {
    return resolveDestinationCoordinates(waypoint.id);
  }

  if (hasCoordinateWaypoint(waypoint)) {
    return {
      label: waypoint.label || "Custom waypoint",
      latitude: Number(waypoint.latitude),
      longitude: Number(waypoint.longitude),
    };
  }

  throw badRequest("Waypoint must include a destination id or latitude/longitude");
}

export async function getDirections(payload = {}) {
  const profile = payload.profile || "driving";
  if (!SUPPORTED_PROFILES.has(profile)) {
    throw badRequest("Unsupported routing profile");
  }

  const waypoints = Array.isArray(payload.waypoints) ? payload.waypoints : [];
  if (waypoints.length < 2) {
    throw new ApiError(400, "At least two waypoints are required", "VALIDATION_ERROR");
  }

  const normalizedWaypoints = await Promise.all(waypoints.map(normalizeWaypoint));
  const route = await getOsrmRoute({ profile, waypoints: normalizedWaypoints });

  return {
    profile,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geometry: route.geometry,
    waypoints: normalizedWaypoints,
    source: "osrm",
  };
}
