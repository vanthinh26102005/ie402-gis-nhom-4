"use client";

import { Car } from "lucide-react";
import type { TrafficInfo } from "@/lib/types/weather-traffic";

type DestinationTrafficWidgetProps = {
  traffic: TrafficInfo;
};

export function DestinationTrafficWidget({ traffic }: DestinationTrafficWidgetProps) {
  const styles = getTrafficStyles(traffic.congestion_level);

  return (
    <div className="relative space-y-4 overflow-hidden rounded-brand-card border border-brand-outline-variant/30 bg-brand-surface-lowest p-6 shadow-sm">
      <div className={`absolute bottom-0 left-0 top-0 w-1 ${styles.accent}`} />

      <div className="flex items-center justify-between border-b border-brand-outline-variant/20 pb-2 pl-1">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary">
          <Car className="size-5 text-brand-primary" />
          Giao thông lân cận
        </h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Cập nhật {formatTime(traffic.observed_at)}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 pl-1">
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles.badge}`}>
            {traffic.congestion_level}
          </span>
          <span className="text-xs font-bold text-slate-700">{traffic.status}</span>
        </div>

        <div className={`rounded-xl border p-3 text-xs leading-relaxed text-slate-600 ${styles.box}`}>
          {traffic.description}
        </div>
      </div>
    </div>
  );
}

function getTrafficStyles(level?: string) {
  switch (level) {
    case "Thông thoáng":
      return {
        accent: "bg-emerald-500",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        box: "border-emerald-100 bg-emerald-50/10",
      };
    case "Chậm":
      return {
        accent: "bg-amber-500",
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        box: "border-amber-100 bg-amber-50/10",
      };
    case "Ùn tắc":
    case "Cấm đường":
      return {
        accent: "bg-rose-500",
        badge: "border-rose-200 bg-rose-50 text-rose-700",
        box: "border-rose-100 bg-rose-50/10",
      };
    default:
      return {
        accent: "bg-slate-400",
        badge: "border-slate-200 bg-slate-50 text-slate-700",
        box: "border-slate-100 bg-slate-50/10",
      };
  }
}

function formatTime(timeStr: string) {
  try {
    return new Date(timeStr).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "15:00";
  }
}
