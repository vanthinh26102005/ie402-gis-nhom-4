"use client";

import { useEffect } from "react";
import { Polyline, useMap } from "react-leaflet";
import { lineStringToLatLngs } from "@/lib/format/gis";
import type { GeoJsonLineString } from "@/lib/types/geojson";

const routeStyle = {
  color: "#dc2626",
  opacity: 0.85,
  weight: 5,
};

type RoutePolylineProps = {
  geometry?: GeoJsonLineString | null;
};

function FitRouteBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [36, 36] });
    }
  }, [map, positions]);

  return null;
}

export function RoutePolyline({ geometry }: RoutePolylineProps) {
  const positions = lineStringToLatLngs(geometry);

  if (!positions.length) {
    return null;
  }

  return (
    <>
      <Polyline positions={positions} pathOptions={routeStyle} />
      <FitRouteBounds positions={positions} />
    </>
  );
}
