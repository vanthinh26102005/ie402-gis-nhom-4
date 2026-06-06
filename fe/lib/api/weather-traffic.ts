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
  location?: {
    latitude: number | string | null;
    longitude: number | string | null;
  };
  geometry?: WeatherInfo["geometry"];
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
  location?: {
    latitude: number | string | null;
    longitude: number | string | null;
  };
  geometry?: TrafficInfo["geometry"];
};

type TemporalQuery = {
  mode?: "latest" | "all" | "at";
  at?: string;
  from?: string;
  to?: string;
  bbox?: string;
  limit?: number;
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

function buildTemporalSearchParams(query?: TemporalQuery) {
  const params = new URLSearchParams();

  if (!query) return "";
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getAllWeather(query?: TemporalQuery): Promise<WeatherInfo[]> {
  const weather = await fetchApi<WeatherApiItem[]>(`/weather${buildTemporalSearchParams(query)}`);

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
      location: item.location
        ? {
            latitude: toNumber(item.location.latitude),
            longitude: toNumber(item.location.longitude),
          }
        : undefined,
      geometry: item.geometry,
    };
  });
}

export async function getAllTraffic(query?: TemporalQuery): Promise<TrafficInfo[]> {
  const traffic = await fetchApi<TrafficApiItem[]>(`/traffic${buildTemporalSearchParams(query)}`);

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
    location: item.location
      ? {
          latitude: toNumber(item.location.latitude),
          longitude: toNumber(item.location.longitude),
        }
      : undefined,
    geometry: item.geometry,
  }));
}

export function getTrafficAlerts(): Promise<TrafficAlert[]> {
  return fetchApi<TrafficAlert[]>("/traffic/alerts");
}
