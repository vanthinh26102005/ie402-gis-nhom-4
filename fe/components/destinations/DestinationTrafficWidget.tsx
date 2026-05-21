"use client";

import { Car } from "lucide-react";
import { TrafficInfo } from "@/lib/mockData";

interface DestinationTrafficWidgetProps {
  traffic: TrafficInfo;
}

export function DestinationTrafficWidget({ traffic }: DestinationTrafficWidgetProps) {
  // Traffic color selector
  const getTrafficStyles = (level?: string) => {
    switch (level) {
      case "Thông thoáng":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: "text-emerald-500",
          bg: "border-emerald-100 bg-emerald-50/10",
        };
      case "Chậm":
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          icon: "text-amber-500",
          bg: "border-amber-100 bg-amber-50/10",
        };
      case "Ùn tắc":
        return {
          badge: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
          icon: "text-rose-500",
          bg: "border-rose-100 bg-rose-50/10",
        };
      case "Cấm đường":
        return {
          badge: "bg-purple-50 text-purple-700 border-purple-200 animate-pulse",
          icon: "text-purple-500",
          bg: "border-purple-100 bg-purple-50/10",
        };
      default:
        return {
          badge: "bg-slate-50 text-slate-700 border-slate-200",
          icon: "text-slate-500",
          bg: "border-slate-100 bg-slate-50/10",
        };
    }
  };

  const styles = getTrafficStyles(traffic.congestion_level);

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "15:00";
    }
  };

  return (
    <div className="bg-brand-surface-lowest rounded-brand-card p-6 border border-brand-outline-variant/30 shadow-sm space-y-4 relative overflow-hidden">
      {/* Visual left accent */}
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${traffic.congestion_level === "Thông thoáng" ? "bg-emerald-500" : traffic.congestion_level === "Chậm" ? "bg-amber-500" : "bg-rose-500"}`} />

      <div className="flex justify-between items-center border-b border-brand-outline-variant/20 pb-2 pl-1">
        <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
          <Car className="size-5 text-brand-primary" /> Giao thông lân cận
        </h3>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          Cập nhật {formatTime(traffic.observed_at)}
        </span>
      </div>

      {/* Status Badge */}
      <div className="flex flex-col gap-2.5 pl-1">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${styles.badge}`}>
            {traffic.congestion_level}
          </span>
          <span className="text-xs font-bold text-slate-700">
            {traffic.status}
          </span>
        </div>

        {/* Description box */}
        <div className={`text-xs text-slate-600 leading-relaxed p-3 rounded-xl border ${styles.bg}`}>
          {traffic.description}
        </div>
      </div>
    </div>
  );
}
