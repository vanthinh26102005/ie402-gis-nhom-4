"use client";

import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { TrafficAlert } from "@/lib/types/weather-traffic";

export function TrafficAlertList({ alerts }: { alerts: TrafficAlert[] }) {
  if (!alerts.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      {alerts.map((alert) => {
        const isDanger = alert.level === "Cấm đường";

        return (
          <div
            key={alert.id}
            className={`flex items-start gap-4 rounded-lg border p-4 shadow-sm ${
              isDanger
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            <span className={`rounded-md p-2 ${isDanger ? "bg-rose-100" : "bg-amber-100"}`}>
              {isDanger ? (
                <ShieldAlert className="size-5" aria-hidden="true" />
              ) : (
                <AlertTriangle className="size-5" aria-hidden="true" />
              )}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white/70 px-2 py-1 text-xs font-bold">
                  {alert.level}
                </span>
                <h2 className="text-sm font-semibold">{alert.title}</h2>
              </div>
              <p className="mt-1 text-sm leading-6 opacity-90">{alert.content}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
