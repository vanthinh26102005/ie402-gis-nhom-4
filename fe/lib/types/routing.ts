import type { Coordinate, GeoJsonLineString } from "@/lib/types/geojson";

export type RouteResult = {
  profile: string;
  distanceMeters: number;
  durationSeconds: number;
  geometry: GeoJsonLineString;
  waypoints: Array<Coordinate & { label: string }>;
  source: "osrm";
};
