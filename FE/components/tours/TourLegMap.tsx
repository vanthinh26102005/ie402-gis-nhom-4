"use client";

import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import type { TourDestination, TourLeg } from "@/lib/types/tour";

type LatLng = [number, number];

function FitLeg({ points }: { points: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) map.fitBounds(points, { padding: [32, 32] });
  }, [map, points]);
  return null;
}

function getLegPoints(leg: TourLeg, from: TourDestination, to: TourDestination): LatLng[] {
  const geometry = leg.routeGeometry as { coordinates?: [number, number][] } | null;
  if (geometry?.coordinates?.length) {
    return geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]);
  }
  return [
    [from.location.latitude, from.location.longitude],
    [to.location.latitude, to.location.longitude],
  ];
}

export function TourLegMap({
  leg,
  from,
  to,
}: {
  leg: TourLeg;
  from: TourDestination;
  to: TourDestination;
}) {
  const points = useMemo(() => getLegPoints(leg, from, to), [from, leg, to]);
  return (
    <MapContainer
      center={points[0]}
      zoom={11}
      scrollWheelZoom
      className="h-full min-h-64 w-full"
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={points} pathOptions={{ color: "#e11d48", weight: 5, opacity: 0.85 }} />
      <CircleMarker center={points[0]} radius={9} pathOptions={{ color: "#222222", fillColor: "#ffffff", fillOpacity: 1, weight: 4 }} />
      <CircleMarker center={points.at(-1) || points[0]} radius={9} pathOptions={{ color: "#e11d48", fillColor: "#ffffff", fillOpacity: 1, weight: 4 }} />
      <FitLeg points={points} />
    </MapContainer>
  );
}
