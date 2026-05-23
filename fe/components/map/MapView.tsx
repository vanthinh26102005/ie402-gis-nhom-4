"use client";

import dynamic from "next/dynamic";

const TourismLeafletMap = dynamic(
  () => import("@/components/map/TourismLeafletMap").then((mod) => mod.TourismLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600">
        Đang tải bản đồ...
      </div>
    ),
  },
);

export function MapView() {
  return <TourismLeafletMap />;
}
