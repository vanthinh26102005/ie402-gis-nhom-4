"use client";

import L from "leaflet";
import { Eye, EyeOff, Layers, MapPin, Route, Settings2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import {
  DEFAULT_LAYER_VISIBILITY,
  MAP_CENTER,
  MAP_LAYERS,
  MAP_POINTS,
  MAP_ZOOM,
  TOURISM_ROUTE,
  getLayerPointCount,
  type MapLayerId,
  type MapPoint,
} from "@/lib/map-data";

const layerIcons = {
  destinations: MapPin,
  services: Settings2,
  route: Route,
} satisfies Record<MapLayerId, typeof MapPin>;

const tourismRouteStyle = {
  color: "#dc2626",
  opacity: 0.78,
  weight: 4,
};

function createMarkerIcon(point: MapPoint) {
  const color = point.layerId === "destinations" ? "#2563eb" : "#059669";

  return L.divIcon({
    className: "tourism-map-pin",
    html: `<span style="background:${color}; border-color:white;" aria-hidden="true"></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

export function TourismLeafletMap() {
  const [visibleLayers, setVisibleLayers] = useState(DEFAULT_LAYER_VISIBILITY);

  const visiblePoints = MAP_POINTS.filter((point) => visibleLayers[point.layerId]);

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
          maxZoom={14}
          scrollWheelZoom
          zoomControl={false}
          className="h-full min-h-[520px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {visibleLayers.route ? (
            <Polyline
              positions={TOURISM_ROUTE}
              pathOptions={tourismRouteStyle}
            />
          ) : null}

          {visiblePoints.map((point) => (
            <Marker
              key={point.id}
              position={point.position}
              icon={createMarkerIcon(point)}
              title={point.name}
            >
              <Popup>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{point.name}</p>
                    <p className="text-xs text-slate-600">
                      {point.category} - {point.province}
                    </p>
                  </div>
                  <p className="text-xs leading-5 text-slate-600">{point.description}</p>
                  <Link
                    href={point.href}
                    className="inline-flex rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <aside className="border-t border-slate-200 p-4 lg:border-l lg:border-t-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Lớp dữ liệu</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Bản đồ MVP</h2>
          </div>
          <Link
            href="/map/layers"
            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            aria-label="Xem trạng thái lớp dữ liệu"
          >
            <Layers className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {MAP_LAYERS.map((layer) => {
            const Icon = layerIcons[layer.id];
            const isVisible = visibleLayers[layer.id];
            const ToggleIcon = isVisible ? Eye : EyeOff;

            return (
              <button
                key={layer.id}
                type="button"
                aria-pressed={isVisible}
                onClick={() => toggleLayer(layer.id)}
                className="flex w-full gap-3 rounded-md border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <span
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: layer.color }}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-950">{layer.label}</span>
                    <ToggleIcon className="size-4 shrink-0 text-slate-500" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">
                    {layer.description}
                  </span>
                  <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {getLayerPointCount(layer.id)} đối tượng
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">Đang hiển thị</p>
          <p className="mt-1 text-sm text-slate-600">
            {visiblePoints.length} marker và {visibleLayers.route ? "1 tuyến kết nối" : "0 tuyến kết nối"}
          </p>
        </div>
      </aside>
    </section>
  );
}
