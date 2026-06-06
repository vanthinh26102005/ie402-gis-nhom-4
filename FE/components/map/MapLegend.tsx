"use client";

import type { MapLayerId } from "@/components/map/LayerTogglePanel";

const weatherLegend = [
  { color: "#ff385c", label: "Nắng nóng / cảnh báo" },
  { color: "#2563eb", label: "Mưa / bão" },
  { color: "#64748b", label: "Mây / sương" },
  { color: "#f59e0b", label: "Nắng ráo" },
];

const trafficLegend = [
  { color: "#059669", label: "Thông thoáng" },
  { color: "#f59e0b", label: "Chậm" },
  { color: "#dc2626", label: "Ùn tắc" },
  { color: "#222222", label: "Cấm đường" },
];

const heatmapLegend = [
  { color: "#10b981", label: "Thấp" },
  { color: "#f59e0b", label: "Trung bình" },
  { color: "#ff385c", label: "Cao" },
  { color: "#7f1d1d", label: "Rất cao" },
];

type MapLegendProps = {
  visibleLayers: Record<MapLayerId, boolean>;
};

export function MapLegend({ visibleLayers }: MapLegendProps) {
  if (
    !visibleLayers.weather &&
    !visibleLayers.traffic &&
    !visibleLayers.trafficHeatmap &&
    !visibleLayers.weatherRiskHeatmap
  ) {
    return null;
  }

  return (
    <aside className="fixed bottom-20 right-4 z-[1050] hidden w-[240px] rounded-lg border border-white/70 bg-white/90 p-3 text-xs shadow-brand-map backdrop-blur-xl md:block">
      <h2 className="font-bold text-brand-secondary">Chú giải dữ liệu</h2>
      {visibleLayers.weather ? (
        <LegendGroup title="Thời tiết" items={weatherLegend} />
      ) : null}
      {visibleLayers.traffic ? (
        <LegendGroup title="Giao thông" items={trafficLegend} />
      ) : null}
      {visibleLayers.trafficHeatmap ? (
        <LegendGroup title="Heatmap kẹt xe" items={heatmapLegend} />
      ) : null}
      {visibleLayers.weatherRiskHeatmap ? (
        <LegendGroup title="Heatmap thời tiết" items={heatmapLegend} />
      ) : null}
    </aside>
  );
}

function LegendGroup({
  items,
  title,
}: {
  items: Array<{ color: string; label: string }>;
  title: string;
}) {
  return (
    <div className="mt-3">
      <p className="mb-2 font-semibold text-[#6a6a6a]">{title}</p>
      <div className="grid gap-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[#6a6a6a]">
            <span
              className="size-3 rounded-full border border-white"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
