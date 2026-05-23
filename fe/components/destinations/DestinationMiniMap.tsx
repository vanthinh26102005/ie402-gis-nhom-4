"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import type { Coordinate } from "@/lib/gis";

const markerIcon = L.divIcon({
  className: "tourism-map-pin",
  html: '<span style="background:#2563eb; border-color:white;" aria-hidden="true"></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

type DestinationMiniMapProps = {
  location: Coordinate;
  name: string;
};

export function DestinationMiniMap({ location, name }: DestinationMiniMapProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-72 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <Marker
          position={[location.latitude, location.longitude]}
          icon={markerIcon}
          title={name}
        />
      </MapContainer>
    </div>
  );
}
