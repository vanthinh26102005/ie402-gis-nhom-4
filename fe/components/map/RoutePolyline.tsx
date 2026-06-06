"use client";

import { useEffect } from "react";
import { Polyline, useMap } from "react-leaflet";
import { lineStringToLatLngs } from "@/lib/format/gis";
import type { GeoJsonLineString } from "@/lib/types/geojson";
import type { RouteAlternative } from "@/lib/types/routing";

const routeStyle = {
  color: "#dc2626",
  opacity: 0.85,
  weight: 5,
};

const alternativeRouteStyle = {
  color: "#475569",
  dashArray: "8 8",
  opacity: 0.48,
  weight: 4,
};

type RoutePolylineProps = {
  alternativeRoutes?: RouteAlternative[];
  geometry?: GeoJsonLineString | null;
  onAlternativeSelect?: (alternativeId: RouteAlternative["id"]) => void;
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

export function RoutePolyline({
  alternativeRoutes = [],
  geometry,
  onAlternativeSelect,
}: RoutePolylineProps) {
  const positions = lineStringToLatLngs(geometry);

  if (!positions.length) {
    return null;
  }

  return (
    <>
      {alternativeRoutes.map((alternative) => {
        const alternativePositions = lineStringToLatLngs(alternative.route.geometry);
        if (!alternativePositions.length) return null;

        return (
          <Polyline
            key={alternative.id}
            positions={alternativePositions}
            pathOptions={alternativeRouteStyle}
            eventHandlers={
              onAlternativeSelect
                ? {
                    click: () => onAlternativeSelect(alternative.id),
                  }
                : undefined
            }
          />
        );
      })}
      <Polyline positions={positions} pathOptions={routeStyle} />
      <FitRouteBounds positions={positions} />
    </>
  );
}
