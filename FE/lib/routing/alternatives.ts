import type { DestinationSummary } from "@/lib/types/destination";
import type { RouteAlternativeKind } from "@/lib/types/routing";
import type { TrafficInfo, WeatherInfo } from "@/lib/types/weather-traffic";

export type RouteAlternativeCandidate = {
  description: string;
  id: RouteAlternativeKind;
  label: string;
  waypointIds: string[];
};

type CandidateScore = {
  detourKm: number;
  destination: DestinationSummary;
  riskScore: number;
};

const DEFAULT_RISK_SCORE = 1.2;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  start: DestinationSummary["location"],
  end: DestinationSummary["location"],
) {
  const earthRadiusKm = 6371;
  const latDistance = toRadians(end.latitude - start.latitude);
  const lonDistance = toRadians(end.longitude - start.longitude);
  const lat1 = toRadians(start.latitude);
  const lat2 = toRadians(end.latitude);
  const haversine =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDistance / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

function getTrafficRisk(item: TrafficInfo) {
  if (item.congestion_level === "Cấm đường") return 5;
  if (item.congestion_level === "Ùn tắc") return 4;
  if (item.congestion_level === "Chậm") return 2;
  return 0;
}

function getWeatherRisk(item: WeatherInfo) {
  let score = 0;

  if (item.weather_status === "Mưa bão") score = 5;
  else if (item.weather_status === "Mưa rào") score = 3;
  else if (item.weather_status === "Có sương mù") score = 2.7;
  else if (item.weather_status === "Nắng nóng") score = 2.5;
  else if (item.weather_status === "Nhiều mây") score = 0.8;

  if (item.temperature >= 35) score = Math.max(score, 4.5);
  else if (item.temperature >= 32) score = Math.max(score, 3);

  if (item.wind_speed >= 30) score = Math.max(score, 4.5);
  else if (item.wind_speed >= 20) score = Math.max(score, 3);

  if (item.humidity >= 90) score += 0.5;

  return Math.min(score, 5);
}

function getAverageRisk<T>(items: T[], getRisk: (item: T) => number) {
  if (items.length === 0) return DEFAULT_RISK_SCORE;
  return items.reduce((sum, item) => sum + getRisk(item), 0) / items.length;
}

function getDestinationRisk(
  destinationId: string,
  traffic: TrafficInfo[],
  weather: WeatherInfo[],
) {
  const destinationTraffic = traffic.filter((item) => item.destination_id === destinationId);
  const destinationWeather = weather.filter((item) => item.destination_id === destinationId);

  return (
    getAverageRisk(destinationTraffic, getTrafficRisk) * 0.6 +
    getAverageRisk(destinationWeather, getWeatherRisk) * 0.4
  );
}

export function buildRouteAlternativeCandidates({
  destinations,
  endId,
  startId,
  traffic,
  weather,
}: {
  destinations: DestinationSummary[];
  endId: string;
  startId: string;
  traffic: TrafficInfo[];
  weather: WeatherInfo[];
}): RouteAlternativeCandidate[] {
  const startDestination = destinations.find((destination) => destination.id === startId);
  const endDestination = destinations.find((destination) => destination.id === endId);

  const baseCandidate: RouteAlternativeCandidate = {
    description: "Đi thẳng đến điểm đến, phù hợp khi bạn muốn tiết kiệm thời gian.",
    id: "fastest",
    label: "Nhanh nhất",
    waypointIds: [],
  };

  if (!startDestination || !endDestination) return [baseCandidate];

  const directDistanceKm = Math.max(
    getDistanceKm(startDestination.location, endDestination.location),
    1,
  );
  const maxDetourKm = Math.max(25, directDistanceKm * 0.75);
  const candidates: CandidateScore[] = destinations
    .filter((destination) => destination.id !== startId && destination.id !== endId)
    .map((destination) => {
      const detourKm =
        getDistanceKm(startDestination.location, destination.location) +
        getDistanceKm(destination.location, endDestination.location) -
        directDistanceKm;

      return {
        destination,
        detourKm,
        riskScore: getDestinationRisk(destination.id, traffic, weather),
      };
    })
    .filter((candidate) => candidate.detourKm <= maxDetourKm);

  const lowRiskWaypoint = [...candidates].sort((left, right) => {
    const riskDelta = left.riskScore - right.riskScore;
    if (Math.abs(riskDelta) > 0.2) return riskDelta;
    return left.detourKm - right.detourKm;
  })[0]?.destination;

  const scenicWaypoint = [...candidates]
    .filter((candidate) => candidate.destination.id !== lowRiskWaypoint?.id)
    .sort((left, right) => {
      const ratingDelta = (right.destination.rating ?? 0) - (left.destination.rating ?? 0);
      if (Math.abs(ratingDelta) > 0.2) return ratingDelta;
      return left.detourKm - right.detourKm;
    })[0]?.destination;

  const alternatives = [baseCandidate];

  if (lowRiskWaypoint) {
    alternatives.push({
      description: `Đi qua ${lowRiskWaypoint.name}, ưu tiên hành trình dễ chịu hơn khi có đông xe hoặc thời tiết không thuận lợi.`,
      id: "low_risk",
      label: "Êm hơn",
      waypointIds: [lowRiskWaypoint.id],
    });
  }

  if (scenicWaypoint) {
    alternatives.push({
      description: `Ghé thêm ${scenicWaypoint.name}, phù hợp nếu bạn muốn tham quan nhiều hơn trên đường đi.`,
      id: "scenic",
      label: "Tham quan nhiều hơn",
      waypointIds: [scenicWaypoint.id],
    });
  }

  return alternatives;
}
