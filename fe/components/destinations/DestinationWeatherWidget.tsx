"use client";

import { CloudSun, Sun, Cloud, CloudRain, CloudLightning, CloudFog, Droplets, Wind } from "lucide-react";
import { WeatherInfo } from "@/lib/mockData";

interface DestinationWeatherWidgetProps {
  weather: WeatherInfo;
}

export function DestinationWeatherWidget({ weather }: DestinationWeatherWidgetProps) {
  // Weather icon selector
  const getWeatherIcon = (status?: string) => {
    switch (status) {
      case "Nắng ráo":
        return <Sun className="size-9 text-amber-500 animate-spin-slow" />;
      case "Nắng nóng":
        return <Sun className="size-9 text-orange-500 animate-pulse" />;
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
  };

  // Convert observed_at to a human readable format
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "15:00";
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand-surface-lowest to-brand-surface-low rounded-brand-card p-6 border border-brand-outline-variant/30 shadow-sm space-y-4 relative overflow-hidden group">
      {/* Visual top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400" />
      
      <div className="flex justify-between items-center border-b border-brand-outline-variant/20 pb-2">
        <h3 className="text-lg font-bold text-brand-primary">Thời tiết thực tế</h3>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          Cập nhật {formatTime(weather.observed_at)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">
            {weather.temperature}°C
          </span>
          <p className="text-xs font-bold text-brand-secondary mt-1">
            {weather.weather_status}
          </p>
        </div>
        <div className="p-2 bg-white rounded-2xl shadow-inner border border-slate-100/50 group-hover:scale-110 transition-transform">
          {getWeatherIcon(weather.weather_status)}
        </div>
      </div>

      {/* Detailed weather stats */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-brand-outline-variant/20">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/50 px-2 py-1.5 rounded-xl border border-slate-200/40">
          <Droplets className="size-4 text-sky-500" />
          <span>Độ ẩm: <strong className="text-slate-700">{weather.humidity}%</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/50 px-2 py-1.5 rounded-xl border border-slate-200/40">
          <Wind className="size-4 text-emerald-500" />
          <span>Gió: <strong className="text-slate-700">{weather.wind_speed} km/h</strong></span>
        </div>
      </div>
    </div>
  );
}
