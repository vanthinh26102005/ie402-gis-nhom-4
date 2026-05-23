import { API_BASE_URL } from "@/lib/api";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type GeoJsonPoint = {
  type: "Point";
  coordinates: [number, number];
};

export type GeoJsonLineString = {
  type: "LineString";
  coordinates: [number, number][];
};

export type GeoJsonPolygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

export type GeoJsonFeature<TProperties, TGeometry = GeoJsonPoint> = {
  type: "Feature";
  geometry: TGeometry;
  properties: TProperties;
};

export type GeoJsonFeatureCollection<TProperties, TGeometry = GeoJsonPoint> = {
  type: "FeatureCollection";
  features: GeoJsonFeature<TProperties, TGeometry>[];
};

export type DestinationSummary = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  province: {
    id?: string;
    name: string;
    code: string;
  };
  category: {
    id?: string;
    name: string;
  } | null;
  rating: number | null;
  ticketPrice: number | null;
  imageUrl: string | null;
  location: Coordinate;
};

export type DestinationDetail = DestinationSummary & {
  openTime: string | null;
  closeTime: string | null;
  videoUrl: string | null;
  geometry: GeoJsonPoint;
  weather: {
    temperature: number | null;
    humidity: number | null;
    weatherStatus: string | null;
    windSpeed: number | null;
    observedAt: string;
  } | null;
  traffic: {
    congestionLevel: number;
    status: string;
    description: string | null;
    observedAt: string;
  } | null;
};

export type DestinationFeatureProperties = {
  id: string;
  name: string;
  provinceName: string;
  provinceCode: string;
  categoryId: string | null;
  categoryName: string | null;
  rating: string | number | null;
  ticketPrice: string | number | null;
  address: string | null;
  description: string | null;
  imageUrl: string | null;
};

export type ServiceFeatureProperties = {
  id: string;
  name: string;
  type: "hotel" | "restaurant" | "parking" | "medical" | "gas_station" | "other";
  provinceName: string;
  provinceCode: string;
  rating: string | number | null;
  address: string | null;
  phone: string | null;
  description: string | null;
};

export type RouteResult = {
  profile: string;
  distanceMeters: number;
  durationSeconds: number;
  geometry: GeoJsonLineString;
  waypoints: Array<Coordinate & { label: string }>;
  source: "osrm";
};

type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
  error: { message: string; code?: string } | null;
  message?: string;
};

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message || payload.message || "Request failed");
  }

  return payload.data;
}

export function lngLatToLatLng(coordinate: [number, number]): [number, number] {
  return [coordinate[1], coordinate[0]];
}

export function lineStringToLatLngs(geometry?: GeoJsonLineString | null) {
  return geometry?.coordinates.map(lngLatToLatLng) ?? [];
}

export function formatDistance(meters: number) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} phút`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours} giờ ${remainingMinutes} phút` : `${hours} giờ`;
}

export async function fetchDestinations() {
  return fetchApi<DestinationSummary[]>("/destinations?limit=100");
}

export async function fetchDestinationDetail(id: string) {
  return fetchApi<DestinationDetail>(`/destinations/${id}`);
}

export async function fetchDestinationFeatures() {
  return fetchApi<GeoJsonFeatureCollection<DestinationFeatureProperties>>(
    "/geo/destinations",
  );
}

export async function fetchServiceFeatures() {
  return fetchApi<GeoJsonFeatureCollection<ServiceFeatureProperties>>("/geo/services");
}

export async function requestDirections(startId: string, endId: string) {
  return fetchApi<RouteResult>("/routing/directions", {
    method: "POST",
    body: JSON.stringify({
      profile: "driving",
      waypoints: [
        { type: "destination", id: startId },
        { type: "destination", id: endId },
      ],
    }),
  });
}
