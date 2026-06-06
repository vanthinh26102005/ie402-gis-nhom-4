import type { Coordinate, GeoJsonLineString } from "@/lib/types/geojson";

export type RouteResult = {
  profile: string;
  distanceMeters: number;
  durationSeconds: number;
  geometry: GeoJsonLineString;
  waypoints: Array<Coordinate & { label: string }>;
  source: "osrm";
};

export type RouteAlternativeKind = "fastest" | "low_risk" | "scenic";

export type RouteAlternative = {
  id: RouteAlternativeKind;
  description: string;
  kind: RouteAlternativeKind;
  label: string;
  route: RouteResult;
  waypointIds: string[];
};
