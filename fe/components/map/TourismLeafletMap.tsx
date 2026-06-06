"use client";

import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import {
  DestinationPopup,
  ServicePopup,
  TrafficPopup,
  WeatherPopup,
} from "@/components/map/DestinationPopup";
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
  GeoJsonFeature,
  GeoJsonLineString,
} from "@/lib/types/geojson";
import type { RouteAlternative } from "@/lib/types/routing";
import type { ServiceFeatureProperties } from "@/lib/types/service";
import type { TrafficInfo, WeatherInfo } from "@/lib/types/weather-traffic";
import { lngLatToLatLng } from "@/lib/format/gis";
import { cn } from "@/lib/utils";

export type { MapLayerId } from "@/components/map/LayerTogglePanel";

const MAP_CENTER: [number, number] = [16.33, 107.66];
const MAP_ZOOM = 8;

export const defaultLayerVisibility: Record<MapLayerId, boolean> = {
  destinations: true,
  services: true,
  weather: true,
  traffic: true,
  trafficHeatmap: false,
  weatherRiskHeatmap: false,
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

function createEndpointIcon(label: "A" | "B", color: string) {
  return L.divIcon({
    className: "tourism-map-route-pin",
    html: `<span style="background:${color}; border-color:white;" aria-hidden="true"><strong>${label}</strong></span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
}

const destinationIcon = createMarkerIcon("#2563eb");
const routeStartIcon = createEndpointIcon("A", "#059669");
const routeEndIcon = createEndpointIcon("B", "#dc2626");
const serviceIcon = createMarkerIcon("#059669");

type RouteEndpointIds = {
  endId?: string | null;
  startId?: string | null;
};

type RouteEndpointFeature = {
  feature: GeoJsonFeature<DestinationFeatureProperties>;
  role: "end" | "start";
};

function getRouteEndpointFeatureIds(startId?: string | null, endId?: string | null) {
  return new Set([startId, endId].filter(Boolean));
}

function FocusDestination({
  destinations,
  selectedDestinationId,
}: {
  destinations: GeoJsonFeatureCollection<DestinationFeatureProperties>;
  selectedDestinationId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedDestinationId) return;
    const selected = destinations.features.find((feature) => feature.properties.id === selectedDestinationId);
    if (!selected) return;
    map.flyTo(lngLatToLatLng(selected.geometry.coordinates), Math.max(map.getZoom(), 13), {
      animate: true,
      duration: 0.65,
    });
  }, [destinations.features, map, selectedDestinationId]);

  return null;
}

function FocusRouteBounds({
  destinations,
  routeEndpointIds,
  routeGeometry,
}: {
  destinations: GeoJsonFeatureCollection<DestinationFeatureProperties>;
  routeEndpointIds?: RouteEndpointIds;
  routeGeometry?: GeoJsonLineString | null;
}) {
  const map = useMap();
  const routeStartId = routeEndpointIds?.startId;
  const routeEndId = routeEndpointIds?.endId;

  useEffect(() => {
    const routePoints = routeGeometry?.coordinates.map(lngLatToLatLng) ?? [];
    const endpointIds = getRouteEndpointFeatureIds(routeStartId, routeEndId);
    const endpointPoints = destinations.features
      .filter((feature) => endpointIds.has(feature.properties.id))
      .map((feature) => lngLatToLatLng(feature.geometry.coordinates));
    const points = routePoints.length > 0 ? routePoints : endpointPoints;

    if (points.length === 0) return;

    if (points.length === 1) {
      map.flyTo(points[0], Math.max(map.getZoom(), 12), {
        animate: true,
        duration: 0.55,
      });
      return;
    }

    map.fitBounds(points, {
      animate: true,
      duration: 0.55,
      maxZoom: routePoints.length > 0 ? 13 : 11,
      padding: [72, 72],
    });
  }, [
    destinations.features,
    map,
    routeEndId,
    routeGeometry,
    routeStartId,
  ]);

  return null;
}

function getWeatherIcon(item: WeatherInfo) {
  if (item.weather_status.includes("Mưa") || item.weather_status.includes("bão")) {
    return createMarkerIcon("#2563eb");
  }
  if (item.weather_status.includes("mây") || item.weather_status.includes("sương")) {
    return createMarkerIcon("#64748b");
  }
  if (item.weather_status.includes("nóng")) {
    return createMarkerIcon("#ff385c");
  }
  return createMarkerIcon("#f59e0b");
}

function getTrafficIcon(item: TrafficInfo) {
  if (item.congestion_level === "Thông thoáng") return createMarkerIcon("#059669");
  if (item.congestion_level === "Chậm") return createMarkerIcon("#f59e0b");
  if (item.congestion_level === "Cấm đường") return createMarkerIcon("#222222");
  return createMarkerIcon("#dc2626");
}

function getTrafficHeatScore(item: TrafficInfo) {
  if (item.congestion_level === "Cấm đường") return 5;
  if (item.congestion_level === "Ùn tắc") return 4;
  if (item.congestion_level === "Chậm") return 2.5;
  return 1;
}

function getWeatherRiskScore(item: WeatherInfo) {
  const status = item.weather_status.toLowerCase();
  let score = 0.8;

  if (status.includes("bão")) score = Math.max(score, 5);
  else if (status.includes("mưa")) score = Math.max(score, 3.5);
  else if (status.includes("sương")) score = Math.max(score, 2.5);
  else if (status.includes("nóng")) score = Math.max(score, 3);

  if (item.temperature >= 35) score = Math.max(score, 5);
  else if (item.temperature >= 32) score = Math.max(score, 3.4);

  if (item.wind_speed >= 30) score = Math.max(score, 4.5);
  else if (item.wind_speed >= 20) score = Math.max(score, 3.2);

  if (item.humidity >= 90) score += 0.6;

  return Math.min(score, 5);
}

function getHeatColor(score: number) {
  if (score >= 4.5) return "#7f1d1d";
  if (score >= 3) return "#ff385c";
  if (score >= 2) return "#f59e0b";
  return "#10b981";
}

function getHeatRadius(score: number) {
  return 18 + score * 8;
}

function getHeatOpacity(score: number) {
  return 0.16 + score * 0.055;
}

function getObservationPosition(observation: WeatherInfo | TrafficInfo): [number, number] | null {
  if (observation.location) {
    return [observation.location.latitude, observation.location.longitude];
  }

  if (observation.geometry?.type === "Point") {
    return lngLatToLatLng(observation.geometry.coordinates);
  }

  return null;
}

type TourismLeafletMapProps = {
  alternativeRoutes?: RouteAlternative[];
  destinations: GeoJsonFeatureCollection<DestinationFeatureProperties>;
  services: GeoJsonFeatureCollection<ServiceFeatureProperties>;
  traffic?: TrafficInfo[];
  weather?: WeatherInfo[];
  routeGeometry?: GeoJsonLineString | null;
  routeEndpointIds?: RouteEndpointIds;
  className?: string;
  mapClassName?: string;
  selectedDestinationId?: string | null;
  showLayerPanel?: boolean;
  variant?: "embedded" | "workspace";
  visibleLayers?: Record<MapLayerId, boolean>;
  onDestinationSelect?: (destinationId: string) => void;
  onRouteAlternativeSelect?: (alternativeId: RouteAlternative["id"]) => void;
  onServiceSelect?: (serviceId: string) => void;
  onToggleLayer?: (layerId: MapLayerId) => void;
};

export function TourismLeafletMap({
  alternativeRoutes,
  className,
  destinations,
  mapClassName,
  onDestinationSelect,
  onRouteAlternativeSelect,
  onServiceSelect,
  onToggleLayer,
  services,
  traffic = [],
  selectedDestinationId,
  showLayerPanel = true,
  routeGeometry,
  routeEndpointIds,
  variant = "embedded",
  visibleLayers: controlledVisibleLayers,
  weather = [],
}: TourismLeafletMapProps) {
  const [internalVisibleLayers, setInternalVisibleLayers] = useState(defaultLayerVisibility);
  const visibleLayers = controlledVisibleLayers ?? internalVisibleLayers;
  const routeStartId = routeEndpointIds?.startId;
  const routeEndId = routeEndpointIds?.endId;

  const counts = useMemo(
    () => ({
      destinations: destinations.features.length,
      services: services.features.length,
      weather: weather.length,
      traffic: traffic.length,
      trafficHeatmap: traffic.length,
      weatherRiskHeatmap: weather.length,
      route: routeGeometry?.coordinates.length ?? 0,
    }),
    [
      destinations.features.length,
      routeGeometry?.coordinates.length,
      services.features.length,
      traffic.length,
      weather.length,
    ],
  );

  const visibleDestinationFeatures = useMemo(() => {
    const endpointIds = getRouteEndpointFeatureIds(routeStartId, routeEndId);
    if (endpointIds.size === 0) return destinations.features;
    return destinations.features.filter((feature) => !endpointIds.has(feature.properties.id));
  }, [
    destinations.features,
    routeEndId,
    routeStartId,
  ]);

  const routeEndpointFeatures = useMemo(() => {
    const endpoints: RouteEndpointFeature[] = [];
    const startFeature = routeStartId
      ? destinations.features.find((feature) => feature.properties.id === routeStartId)
      : null;
    const endFeature = routeEndId
      ? destinations.features.find((feature) => feature.properties.id === routeEndId)
      : null;

    if (startFeature) endpoints.push({ feature: startFeature, role: "start" });
    if (endFeature && endFeature.properties.id !== startFeature?.properties.id) {
      endpoints.push({ feature: endFeature, role: "end" });
    }

    return endpoints;
  }, [
    destinations.features,
    routeEndId,
    routeStartId,
  ]);

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
          <FocusDestination destinations={destinations} selectedDestinationId={selectedDestinationId} />
          <FocusRouteBounds
            destinations={destinations}
            routeEndpointIds={routeEndpointIds}
            routeGeometry={routeGeometry}
          />

          {visibleLayers.route ? (
            <RoutePolyline
              alternativeRoutes={alternativeRoutes}
              geometry={routeGeometry}
              onAlternativeSelect={onRouteAlternativeSelect}
            />
          ) : null}

          {visibleLayers.weatherRiskHeatmap
            ? weather.map((item) => {
                const position = getObservationPosition(item);
                if (!position) return null;

                const score = getWeatherRiskScore(item);
                const color = getHeatColor(score);

                return (
                  <CircleMarker
                    key={`weather-risk-${item.weather_id}`}
                    center={position}
                    radius={getHeatRadius(score)}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: getHeatOpacity(score),
                      opacity: 0.28,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <WeatherPopup weather={item} />
                    </Popup>
                  </CircleMarker>
                );
              })
            : null}

          {visibleLayers.trafficHeatmap
            ? traffic.map((item) => {
                const position = getObservationPosition(item);
                if (!position) return null;

                const score = getTrafficHeatScore(item);
                const color = getHeatColor(score);

                return (
                  <CircleMarker
                    key={`traffic-heat-${item.traffic_id}`}
                    center={position}
                    radius={getHeatRadius(score)}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: getHeatOpacity(score),
                      opacity: 0.28,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <TrafficPopup traffic={item} />
                    </Popup>
                  </CircleMarker>
                );
              })
            : null}

          {visibleLayers.destinations
            ? visibleDestinationFeatures.map((feature) => (
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
                  {!onDestinationSelect ? (
                    <Popup>
                      <DestinationPopup properties={feature.properties} />
                    </Popup>
                  ) : null}
                </Marker>
              ))
            : null}

          {visibleLayers.destinations
            ? routeEndpointFeatures.map(({ feature, role }) => (
                <Marker
                  key={`route-endpoint-${role}-${feature.properties.id}`}
                  position={lngLatToLatLng(feature.geometry.coordinates)}
                  icon={role === "start" ? routeStartIcon : routeEndIcon}
                  title={role === "start" ? `A: ${feature.properties.name}` : `B: ${feature.properties.name}`}
                  zIndexOffset={700}
                  eventHandlers={
                    onDestinationSelect
                      ? {
                          click: () => onDestinationSelect(feature.properties.id),
                        }
                      : undefined
                  }
                >
                  {!onDestinationSelect ? (
                    <Popup>
                      <DestinationPopup properties={feature.properties} />
                    </Popup>
                  ) : null}
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
                  eventHandlers={
                    onServiceSelect
                      ? {
                          click: () => onServiceSelect(feature.properties.id),
                        }
                      : undefined
                  }
                >
                  {!onServiceSelect ? (
                    <Popup>
                      <ServicePopup properties={feature.properties} />
                    </Popup>
                  ) : null}
                </Marker>
              ))
            : null}

          {visibleLayers.weather
            ? weather.map((item) => {
                const position = getObservationPosition(item);
                if (!position) return null;

                return (
                  <Marker
                    key={item.weather_id}
                    position={position}
                    icon={getWeatherIcon(item)}
                    title={item.destination_name || item.weather_status}
                  >
                    <Popup>
                      <WeatherPopup weather={item} />
                    </Popup>
                  </Marker>
                );
              })
            : null}

          {visibleLayers.traffic
            ? traffic.map((item) => {
                const position = getObservationPosition(item);
                if (!position) return null;

                return (
                  <Marker
                    key={item.traffic_id}
                    position={position}
                    icon={getTrafficIcon(item)}
                    title={item.destination_name || item.status}
                  >
                    <Popup>
                      <TrafficPopup traffic={item} />
                    </Popup>
                  </Marker>
                );
              })
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
