import { ApiError } from "../utils/apiError.js";

const DEFAULT_OSRM_BASE_URL = "https://router.project-osrm.org";

export async function getOsrmRoute({ profile = "driving", waypoints }) {
  const baseUrl = (process.env.OSRM_BASE_URL || DEFAULT_OSRM_BASE_URL).replace(/\/$/, "");
  const coordinates = waypoints
    .map((waypoint) => `${waypoint.longitude},${waypoint.latitude}`)
    .join(";");
  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    steps: "false",
  });
  const url = `${baseUrl}/route/v1/${profile}/${coordinates}?${params.toString()}`;

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new ApiError(502, "Routing provider is unavailable", "ROUTING_PROVIDER_ERROR");
  }

  if (!response.ok) {
    throw new ApiError(502, "Routing provider returned an error", "ROUTING_PROVIDER_ERROR");
  }

  const payload = await response.json();
  if (payload.code !== "Ok" || !payload.routes?.length) {
    throw new ApiError(404, "Route not found", "ROUTE_NOT_FOUND");
  }

  return payload.routes[0];
}
