"use client";

import { Eye, EyeOff, MapPin, Route, Settings2 } from "lucide-react";

export type MapLayerId = "destinations" | "services" | "route";

const layerMeta = {
  destinations: {
    label: "Điểm du lịch",
    description: "Marker địa điểm du lịch lấy từ PostGIS.",
    color: "#2563eb",
    icon: MapPin,
  },
  services: {
    label: "Dịch vụ hỗ trợ",
    description: "Khách sạn, nhà hàng, bãi đỗ, y tế và tiện ích.",
    color: "#059669",
    icon: Settings2,
  },
  route: {
    label: "Lộ trình",
    description: "Polyline tuyến đường trả về từ OSRM.",
    color: "#dc2626",
    icon: Route,
  },
} satisfies Record<MapLayerId, {
  label: string;
  description: string;
  color: string;
  icon: typeof MapPin;
}>;

type LayerTogglePanelProps = {
  visibleLayers: Record<MapLayerId, boolean>;
  counts: Record<MapLayerId, number>;
  onToggle: (layerId: MapLayerId) => void;
};

export function LayerTogglePanel({
  visibleLayers,
  counts,
  onToggle,
}: LayerTogglePanelProps) {
  return (
    <aside className="border-t border-slate-200 p-4 lg:border-l lg:border-t-0">
      <div>
        <p className="text-xs font-semibold uppercase text-slate-500">Lớp dữ liệu</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">Bản đồ MVP</h2>
      </div>

      <div className="mt-4 space-y-3">
        {(Object.keys(layerMeta) as MapLayerId[]).map((layerId) => {
          const layer = layerMeta[layerId];
          const Icon = layer.icon;
          const isVisible = visibleLayers[layerId];
          const ToggleIcon = isVisible ? Eye : EyeOff;

          return (
            <button
              key={layerId}
              type="button"
              aria-pressed={isVisible}
              onClick={() => onToggle(layerId)}
              className="flex min-h-24 w-full cursor-pointer gap-3 rounded-md border border-slate-200 bg-white p-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
                  {counts[layerId]} đối tượng
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
