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
import { cn } from "@/lib/utils";

export type { MapLayerId } from "@/components/map/LayerTogglePanel";

const MAP_CENTER: [number, number] = [16.33, 107.66];
const MAP_ZOOM = 8;

export const defaultLayerVisibility: Record<MapLayerId, boolean> = {
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
  className?: string;
  mapClassName?: string;
  selectedDestinationId?: string | null;
  showLayerPanel?: boolean;
  variant?: "embedded" | "workspace";
  visibleLayers?: Record<MapLayerId, boolean>;
  onDestinationSelect?: (destinationId: string) => void;
  onToggleLayer?: (layerId: MapLayerId) => void;
};

export function TourismLeafletMap({
  className,
  destinations,
  mapClassName,
  onDestinationSelect,
  onToggleLayer,
  services,
  selectedDestinationId,
  showLayerPanel = true,
  routeGeometry,
  variant = "embedded",
  visibleLayers: controlledVisibleLayers,
}: TourismLeafletMapProps) {
  const [internalVisibleLayers, setInternalVisibleLayers] = useState(defaultLayerVisibility);
  const visibleLayers = controlledVisibleLayers ?? internalVisibleLayers;

  const counts = useMemo(
    () => ({
      destinations: destinations.features.length,
      services: services.features.length,
      route: routeGeometry?.coordinates.length ?? 0,
    }),
    [destinations.features.length, routeGeometry?.coordinates.length, services.features.length],
  );

  function toggleLayer(layerId: MapLayerId) {
    if (onToggleLayer) {
      onToggleLayer(layerId);
      return;
    }

    setInternalVisibleLayers((current) => ({
      ...current,
      [layerId]: !current[layerId],
    }));
  }

  const isWorkspace = variant === "workspace";

  return (
    <section
      className={cn(
        isWorkspace
          ? "h-full min-h-screen overflow-hidden bg-slate-100"
          : "grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[minmax(0,1fr)_320px]",
        className,
      )}
    >
      <div className={cn("relative", isWorkspace ? "h-full min-h-screen" : "min-h-[520px]")}>
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          minZoom={7}
          maxZoom={16}
          scrollWheelZoom
          zoomControl={false}
          className={cn("h-full w-full", isWorkspace ? "min-h-screen" : "min-h-[520px]", mapClassName)}
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
                  icon={
                    selectedDestinationId === feature.properties.id
                      ? createMarkerIcon("#a87922")
                      : destinationIcon
                  }
                  title={feature.properties.name}
                  eventHandlers={
                    onDestinationSelect
                      ? {
                          click: () => onDestinationSelect(feature.properties.id),
                        }
                      : undefined
                  }
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

      {showLayerPanel ? (
        <LayerTogglePanel
          visibleLayers={visibleLayers}
          counts={counts}
          onToggle={toggleLayer}
        />
      ) : null}
    </section>
  );
}
