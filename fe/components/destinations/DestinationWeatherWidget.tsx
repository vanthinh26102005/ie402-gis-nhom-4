"use client";

import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, Sun, Wind } from "lucide-react";
import type { WeatherInfo } from "@/lib/types/weather-traffic";

type DestinationWeatherWidgetProps = {
  weather: WeatherInfo;
};

export function DestinationWeatherWidget({ weather }: DestinationWeatherWidgetProps) {
  return (
    <div className="group relative space-y-4 overflow-hidden rounded-brand-card border border-brand-outline-variant/30 bg-gradient-to-br from-brand-surface-lowest to-brand-surface-low p-6 shadow-sm">
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400" />

      <div className="flex items-center justify-between border-b border-brand-outline-variant/20 pb-2">
        <h3 className="text-lg font-bold text-brand-primary">Thời tiết thực tế</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Cập nhật {formatTime(weather.observed_at)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-4xl font-extrabold tracking-tighter text-slate-800">
            {weather.temperature}°C
          </span>
          <p className="mt-1 text-xs font-bold text-brand-secondary">
            {weather.weather_status}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100/50 bg-white p-2 shadow-inner transition-transform group-hover:scale-110">
          {getWeatherIcon(weather.weather_status)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-brand-outline-variant/20 pt-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/40 bg-white/50 px-2 py-1.5 text-xs text-slate-500">
          <Droplets className="size-4 text-sky-500" />
          <span>Độ ẩm: <strong className="text-slate-700">{weather.humidity}%</strong></span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/40 bg-white/50 px-2 py-1.5 text-xs text-slate-500">
          <Wind className="size-4 text-emerald-500" />
          <span>Gió: <strong className="text-slate-700">{weather.wind_speed} km/h</strong></span>
        </div>
      </div>
    </div>
  );
}

function getWeatherIcon(status?: string) {
  switch (status) {
    case "Nắng ráo":
      return <Sun className="size-9 text-amber-500" />;
    case "Nắng nóng":
      return <Sun className="size-9 text-orange-500" />;
    case "Nhiều mây":
      return <Cloud className="size-9 text-slate-400" />;
    case "Mưa rào":
      return <CloudRain className="size-9 text-blue-400" />;
    case "Mưa bão":
      return <CloudLightning className="size-9 text-purple-500" />;
    case "Có sương mù":
      return <CloudFog className="size-9 text-zinc-400" />;
    default:
      return <CloudSun className="size-9 text-slate-400" />;
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
