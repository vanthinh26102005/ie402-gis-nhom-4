"use client";

import Link from "next/link";
import type { DestinationFeatureProperties } from "@/lib/types/destination";
import type { ServiceFeatureProperties } from "@/lib/types/service";
import type { TrafficInfo, WeatherInfo } from "@/lib/types/weather-traffic";

type DestinationPopupProps = {
  properties: DestinationFeatureProperties;
};

type ServicePopupProps = {
  properties: ServiceFeatureProperties;
};

type WeatherPopupProps = {
  weather: WeatherInfo;
};

type TrafficPopupProps = {
  traffic: TrafficInfo;
};

export function DestinationPopup({ properties }: DestinationPopupProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-950">{properties.name}</p>
        <p className="text-xs text-slate-600">
          {properties.categoryName || "Địa điểm"} - {properties.provinceName}
        </p>
      </div>
      {properties.description ? (
        <p className="text-xs leading-5 text-slate-600">{properties.description}</p>
      ) : null}
      <Link
        href={`/destinations/${properties.id}`}
        className="inline-flex rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-primary-container"
      >
        Xem chi tiết
      </Link>
    </div>
  );
}

export function ServicePopup({ properties }: ServicePopupProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-950">{properties.name}</p>
        <p className="text-xs text-slate-600">
          {properties.type.replace("_", " ")} - {properties.provinceName}
        </p>
      </div>
      {properties.address ? (
        <p className="text-xs leading-5 text-slate-600">{properties.address}</p>
      ) : null}
      {properties.phone ? (
        <p className="text-xs font-medium text-slate-700">{properties.phone}</p>
      ) : null}
    </div>
  );
}

export function WeatherPopup({ weather }: WeatherPopupProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-950">
          {weather.destination_name || weather.province || "Quan trắc thời tiết"}
        </p>
        <p className="text-xs text-slate-600">{weather.weather_status}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
        <span>{weather.temperature}°C</span>
        <span>{weather.humidity}% ẩm</span>
        <span>{weather.wind_speed} km/h</span>
      </div>
      <p className="text-xs text-slate-500">
        Ghi nhận: {new Date(weather.observed_at).toLocaleString("vi-VN")}
      </p>
    </div>
  );
}

export function TrafficPopup({ traffic }: TrafficPopupProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-950">
          {traffic.destination_name || traffic.route_name || traffic.province || "Điểm giao thông"}
        </p>
        <p className="text-xs text-slate-600">{traffic.congestion_level}</p>
      </div>
      <p className="text-xs leading-5 text-slate-600">{traffic.description}</p>
      <p className="text-xs font-medium text-slate-700">{traffic.status}</p>
      <p className="text-xs text-slate-500">
        Ghi nhận: {new Date(traffic.observed_at).toLocaleString("vi-VN")}
      </p>
    </div>
  );
}
