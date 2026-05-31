"use client";

import { Clock } from "lucide-react";
import type { TrafficInfo } from "@/lib/types/weather-traffic";

function getCongestionStyles(level: TrafficInfo["congestion_level"]) {
  switch (level) {
    case "Thông thoáng":
      return {
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        indicator: "bg-emerald-500",
      };
    case "Chậm":
      return {
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        indicator: "bg-amber-500",
      };
    case "Ùn tắc":
      return {
        badge: "border-rose-200 bg-rose-50 text-rose-700",
        indicator: "bg-rose-500",
      };
    case "Cấm đường":
      return {
        badge: "border-purple-200 bg-purple-50 text-purple-700",
        indicator: "bg-purple-500",
      };
  }
}

export function TrafficCard({ traffic }: { traffic: TrafficInfo }) {
  const styles = getCongestionStyles(traffic.congestion_level);
  const title = traffic.destination_name || traffic.route_name || traffic.destination_id;

  return (
    <article className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {traffic.province}
          </p>
          <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className={`size-2 shrink-0 rounded-full ${styles.indicator}`} />
            {title}
          </h3>
        </div>
        <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-bold ${styles.badge}`}>
          {traffic.congestion_level}
        </span>
      </div>

      <div className="flex items-start gap-2 text-sm font-semibold text-slate-700">
        <Clock className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
        <span>{traffic.status}</span>
      </div>

      <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        {traffic.description}
      </p>

      <p className="text-right text-xs font-medium text-slate-400">
        Ghi nhận: {new Date(traffic.observed_at).toLocaleTimeString("vi-VN")} -{" "}
        {new Date(traffic.observed_at).toLocaleDateString("vi-VN")}
      </p>
    </article>
  );
}
