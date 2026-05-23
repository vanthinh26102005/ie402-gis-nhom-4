"use client";

import L from "leaflet";
import { useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { DestinationPopup, ServicePopup } from "@/components/map/DestinationPopup";
import {
  LayerTogglePanel,
  type MapLayerId,
} from "@/components/map/LayerTogglePanel";
import { RoutePolyline } from "@/components/map/RoutePolyline";
import type {
  DestinationFeatureProperties,
} from "@/lib/types/destination";
import type {
  GeoJsonFeatureCollection,
  GeoJsonLineString,
} from "@/lib/types/geojson";
import type { ServiceFeatureProperties } from "@/lib/types/service";
import { lngLatToLatLng } from "@/lib/format/gis";

const MAP_CENTER: [number, number] = [16.33, 107.66];
const MAP_ZOOM = 8;

const defaultLayerVisibility: Record<MapLayerId, boolean> = {
  destinations: true,
  services: true,
  route: true,
};

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: "tourism-map-pin",
    html: `<span style="background:${color}; border-color:white;" aria-hidden="true"></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

const destinationIcon = createMarkerIcon("#2563eb");
const serviceIcon = createMarkerIcon("#059669");

type TourismLeafletMapProps = {
  destinations: GeoJsonFeatureCollection<DestinationFeatureProperties>;
  services: GeoJsonFeatureCollection<ServiceFeatureProperties>;
  routeGeometry?: GeoJsonLineString | null;
};

export function TourismLeafletMap({
  destinations,
  services,
  routeGeometry,
}: TourismLeafletMapProps) {
  const [visibleLayers, setVisibleLayers] = useState(defaultLayerVisibility);

  const counts = useMemo(
    () => ({
      destinations: destinations.features.length,
      services: services.features.length,
      route: routeGeometry?.coordinates.length ?? 0,
    }),
    [destinations.features.length, routeGeometry?.coordinates.length, services.features.length],
  );

  function toggleLayer(layerId: MapLayerId) {
    setVisibleLayers((current) => ({
      ...current,
      [layerId]: !current[layerId],
    }));
  }

  return (
    <section className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="relative min-h-[520px]">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          minZoom={7}
          maxZoom={16}
          scrollWheelZoom
          zoomControl={false}
          className="h-full min-h-[520px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {visibleLayers.route ? <RoutePolyline geometry={routeGeometry} /> : null}

          {visibleLayers.destinations
            ? destinations.features.map((feature) => (
                <Marker
                  key={feature.properties.id}
                  position={lngLatToLatLng(feature.geometry.coordinates)}
                  icon={destinationIcon}
                  title={feature.properties.name}
                >
                  <Popup>
                    <DestinationPopup properties={feature.properties} />
                  </Popup>
                </Marker>
              ))
            : null}

          {visibleLayers.services
            ? services.features.map((feature) => (
                <Marker
                  key={feature.properties.id}
                  position={lngLatToLatLng(feature.geometry.coordinates)}
                  icon={serviceIcon}
                  title={feature.properties.name}
                >
                  <Popup>
                    <ServicePopup properties={feature.properties} />
                  </Popup>
                </Marker>
              ))
            : null}
        </MapContainer>
      </div>

      <LayerTogglePanel
        visibleLayers={visibleLayers}
        counts={counts}
        onToggle={toggleLayer}
      />
    </section>
  );
}
