import type { GeoJsonLineString } from "@/lib/types/geojson";

export function lngLatToLatLng(coordinate: [number, number]): [number, number] {
  return [coordinate[1], coordinate[0]];
}

export function lineStringToLatLngs(geometry?: GeoJsonLineString | null) {
  return geometry?.coordinates.map(lngLatToLatLng) ?? [];
}
