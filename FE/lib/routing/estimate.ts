import type { RouteResult } from "@/lib/types/routing";
import type { TrafficInfo, WeatherInfo } from "@/lib/types/weather-traffic";

export type TravelMode = "car" | "motorbike" | "walk_transit";

export type RouteEstimate = {
  averageCongestionScore: number;
  averageWeatherRiskScore: number;
  baseSpeedKmh: number;
  congestionFactor: number;
  distanceMeters: number;
  effectiveSpeedKmh: number;
  mode: TravelMode;
  movingDurationSeconds: number;
  paceBufferSeconds: number;
  sourceDurationSeconds: number;
  stopBufferSeconds: number;
  totalDurationSeconds: number;
  weatherFactor: number;
};

const modeBaseSpeeds: Record<TravelMode, number> = {
  car: 42,
  motorbike: 34,
  walk_transit: 15,
};

const congestionScoreByLabel: Record<TrafficInfo["congestion_level"], number> = {
  "Thông thoáng": 0,
  "Chậm": 2,
  "Ùn tắc": 4,
  "Cấm đường": 5,
};

const weatherStatusBaseScore: Record<WeatherInfo["weather_status"], number> = {
  "Nắng ráo": 0,
  "Nắng nóng": 2.5,
  "Nhiều mây": 0.8,
  "Mưa rào": 3,
  "Mưa bão": 5,
  "Có sương mù": 2.7,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getAverageScore<T>(items: T[], getScore: (item: T) => number) {
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + getScore(item), 0) / items.length;
}

function getWeatherRiskScore(item: WeatherInfo) {
  let score = weatherStatusBaseScore[item.weather_status];

  if (item.temperature >= 35) score = Math.max(score, 4.5);
  else if (item.temperature >= 32) score = Math.max(score, 3);

  if (item.wind_speed >= 30) score = Math.max(score, 4.5);
  else if (item.wind_speed >= 20) score = Math.max(score, 3);

  if (item.humidity >= 90) score += 0.5;

  return clamp(score, 0, 5);
}

export function estimateRouteTravelTime({
  pace,
  route,
  traffic,
  travelMode,
  weather = [],
}: {
  pace: number;
  route: RouteResult | null;
  traffic: TrafficInfo[];
  travelMode: TravelMode;
  weather?: WeatherInfo[];
}): RouteEstimate | null {
  if (!route) return null;

  const averageCongestionScore = getAverageScore(
    traffic,
    (item) => congestionScoreByLabel[item.congestion_level],
  );
  const averageWeatherRiskScore = getAverageScore(weather, getWeatherRiskScore);
  const modeTrafficWeight = travelMode === "walk_transit" ? 0.35 : travelMode === "motorbike" ? 0.7 : 1;
  const modeWeatherWeight = travelMode === "walk_transit" ? 0.07 : travelMode === "motorbike" ? 0.055 : 0.045;
  const congestionFactor = clamp(1 - averageCongestionScore * 0.085 * modeTrafficWeight, 0.45, 1);
  const weatherFactor = clamp(1 - averageWeatherRiskScore * modeWeatherWeight, 0.65, 1);
  const baseSpeedKmh = modeBaseSpeeds[travelMode];
  const effectiveSpeedKmh = Math.max(4, baseSpeedKmh * congestionFactor * weatherFactor);
  const distanceKm = route.distanceMeters / 1000;
  const movingSeconds = (distanceKm / effectiveSpeedKmh) * 3600;
  const osrmFloorSeconds = travelMode === "car" ? route.durationSeconds : 0;
  const paceBufferSeconds = pace === 1 ? 8 * 60 : pace === 2 ? 18 * 60 : 32 * 60;
  const stopBufferSeconds = Math.min(45 * 60, distanceKm * 90);

  return {
    averageCongestionScore,
    averageWeatherRiskScore,
    baseSpeedKmh,
    congestionFactor,
    distanceMeters: route.distanceMeters,
    effectiveSpeedKmh,
    mode: travelMode,
    movingDurationSeconds: Math.round(Math.max(movingSeconds, osrmFloorSeconds)),
    paceBufferSeconds,
    sourceDurationSeconds: route.durationSeconds,
    stopBufferSeconds: Math.round(stopBufferSeconds),
    totalDurationSeconds: Math.round(Math.max(movingSeconds, osrmFloorSeconds) + paceBufferSeconds + stopBufferSeconds),
    weatherFactor,
  };
}
