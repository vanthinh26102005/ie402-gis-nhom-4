"use client";

import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, Sun, Wind } from "lucide-react";
import type { WeatherInfo } from "@/lib/types/weather-traffic";

function getWeatherIcon(status: WeatherInfo["weather_status"]) {
  switch (status) {
    case "Nắng ráo":
      return <Sun className="size-10 text-amber-500" aria-hidden="true" />;
    case "Nắng nóng":
      return <Sun className="size-10 text-orange-500" aria-hidden="true" />;
    case "Nhiều mây":
      return <Cloud className="size-10 text-slate-400" aria-hidden="true" />;
    case "Mưa rào":
      return <CloudRain className="size-10 text-blue-400" aria-hidden="true" />;
    case "Mưa bão":
      return <CloudLightning className="size-10 text-purple-500" aria-hidden="true" />;
    case "Có sương mù":
      return <CloudFog className="size-10 text-zinc-400" aria-hidden="true" />;
    default:
      return <CloudSun className="size-10 text-slate-400" aria-hidden="true" />;
  }
}

export function WeatherCard({ weather }: { weather: WeatherInfo }) {
  return (
    <article className="flex min-h-44 flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {weather.province}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-slate-900">
          {weather.destination_name || weather.destination_id}
        </h3>
      </div>

      <div className="my-3 flex items-center justify-between">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {weather.temperature}°C
        </span>
        {getWeatherIcon(weather.weather_status)}
      </div>

      <div className="border-t border-slate-100 pt-3">
        <p className="text-sm font-semibold text-emerald-700">{weather.weather_status}</p>
        <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <Droplets className="size-3.5" aria-hidden="true" />
            {weather.humidity}%
          </span>
          <span className="flex items-center gap-1">
            <Wind className="size-3.5" aria-hidden="true" />
            {weather.wind_speed} km/h
          </span>
        </div>
      </div>
    </article>
  );
}
