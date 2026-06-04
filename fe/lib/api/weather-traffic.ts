import { fetchApi } from "@/lib/api/client";
import type {
  CongestionLabel,
  TrafficAlert,
  TrafficInfo,
  WeatherInfo,
  WeatherStatusLabel,
} from "@/lib/types/weather-traffic";

type WeatherApiItem = {
  weather_id: string;
  destination_id: string | null;
  destination_name: string | null;
  province: string | null;
  temperature: number | string | null;
  humidity: number | null;
  weather_status: string | null;
  wind_speed: number | string | null;
  observed_at: string;
};

type TrafficApiItem = {
  traffic_id: string;
  destination_id: string | null;
  destination_name: string | null;
  province: string | null;
  congestion_level: number | string | null;
  status: string;
  description: string | null;
  observed_at: string;
};

function normalizeWeatherStatus(status: string | null, temperature: number): WeatherStatusLabel {
  const normalized = status?.toLowerCase();

  if (normalized?.includes("rain") || normalized?.includes("mưa")) return "Mưa rào";
  if (normalized?.includes("storm") || normalized?.includes("bão")) return "Mưa bão";
  if (normalized?.includes("fog") || normalized?.includes("sương")) return "Có sương mù";
  if (normalized?.includes("cloud") || normalized?.includes("mây")) return "Nhiều mây";
  if (temperature >= 32) return "Nắng nóng";
  return "Nắng ráo";
}

function normalizeCongestionLevel(level: number | string | null): CongestionLabel {
  const numericLevel = Number(level);

  if (!Number.isFinite(numericLevel) || numericLevel <= 1) return "Thông thoáng";
  if (numericLevel === 2) return "Chậm";
  if (numericLevel >= 5) return "Cấm đường";
  return "Ùn tắc";
}

function toNumber(value: number | string | null) {
  return value === null ? 0 : Number(value);
}

export async function getAllWeather(): Promise<WeatherInfo[]> {
  const weather = await fetchApi<WeatherApiItem[]>("/weather");

  return weather.map((item) => {
    const temperature = toNumber(item.temperature);

    return {
      weather_id: item.weather_id,
      destination_id: item.destination_id ?? undefined,
      destination_name: item.destination_name ?? undefined,
      province: item.province ?? undefined,
      temperature,
      humidity: item.humidity ?? 0,
      weather_status: normalizeWeatherStatus(item.weather_status, temperature),
      wind_speed: toNumber(item.wind_speed),
      observed_at: item.observed_at,
    };
  });
}

export async function getAllTraffic(): Promise<TrafficInfo[]> {
  const traffic = await fetchApi<TrafficApiItem[]>("/traffic");

  return traffic.map((item) => ({
    traffic_id: item.traffic_id,
    destination_id: item.destination_id ?? undefined,
    destination_name: item.destination_name ?? undefined,
    province: item.province ?? undefined,
    route_name: item.destination_name ?? undefined,
    congestion_level: normalizeCongestionLevel(item.congestion_level),
    status: item.status,
    description: item.description ?? "Chưa có mô tả tình trạng giao thông.",
    observed_at: item.observed_at,
  }));
}

export function getTrafficAlerts(): Promise<TrafficAlert[]> {
  return fetchApi<TrafficAlert[]>("/traffic/alerts");
}
