import { fetchApi, fetchApiEnvelope } from "@/lib/api/client";
import type { GeoJsonFeatureCollection } from "@/lib/types/geojson";

export type AdminDashboardStats = {
  destinations: number;
  services: number;
  reviews: number;
  notifications: number;
  pendingReviews: number;
  activeDestinations: number;
};

export type AdminRouteDemand = {
  label: string;
  value: number;
};

export type AdminDestinationMix = {
  label: string;
  count: number;
};

export type AdminDestination = {
  id: string;
  name: string;
  description?: string | null;
  provinceId?: string;
  provinceName?: string;
  provinceCode?: string;
  categoryId?: string | null;
  categoryName?: string | null;
  address?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  ticketPrice?: number | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  rating?: number | null;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  description: string | null;
  destinationsCount: number;
  updatedAt?: string;
};

export type AdminService = {
  id: string;
  name: string;
  type: "hotel" | "restaurant" | "parking" | "medical" | "gas_station" | "other";
  description?: string | null;
  provinceId?: string;
  provinceName?: string;
  provinceCode?: string;
  address?: string | null;
  phone?: string | null;
  rating?: number | null;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type AdminServicePayload = {
  name: string;
  type: AdminService["type"];
  provinceId: string;
  address?: string | null;
  phone?: string | null;
  rating?: number | null;
  description?: string | null;
  location: {
    lat: number;
    lng: number;
  };
};

export type AdminCategoryPayload = {
  name: string;
  description?: string | null;
};

export type AdminNotification = {
  id: string;
  destinationId?: string | null;
  destination_id?: string | null;
  title: string;
  content: string;
  type: "event" | "warning" | "maintenance" | "news";
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
};

export type AdminNotificationPayload = {
  destinationId?: string | null;
  title: string;
  content: string;
  type: AdminNotification["type"];
  status: AdminNotification["status"];
};

export type AdminReview = {
  id: string;
  userId?: string;
  userName: string;
  destinationId?: string;
  destinationName: string;
  content: string | null;
  score: number;
  status: "pending" | "published" | "hidden";
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProvince = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
};

export type AdminDestinationPayload = {
  name: string;
  provinceId: string;
  categoryId?: string | null;
  address?: string | null;
  description?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  ticketPrice?: number | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  rating?: number | null;
  location: {
    lat: number;
    lng: number;
  };
};

export type AdminListMeta = {
  limit: number;
  numberMatched: number;
  numberReturned: number;
  page: number;
  total: number;
};

export type AdminObservationQuery = {
  bbox?: string;
  datetime?: string;
  destinationId?: string;
  from?: string;
  limit?: number;
  page?: number;
  provinceId?: string;
  q?: string;
  to?: string;
};

export type AdminObservationList<T> = {
  items: T[];
  meta: AdminListMeta;
};

export type AdminWeatherObservation = {
  weather_id: string;
  destination_id?: string | null;
  destination_name?: string | null;
  province?: string | null;
  temperature: number | null;
  humidity: number | null;
  weather_status: string | null;
  wind_speed: number | null;
  observed_at: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type AdminTrafficObservation = {
  traffic_id: string;
  destination_id?: string | null;
  destination_name?: string | null;
  province?: string | null;
  congestion_level: number;
  status: string;
  description?: string | null;
  observed_at: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type AdminWeatherObservationPayload = {
  destinationId?: string | null;
  temperature?: number | null;
  humidity?: number | null;
  weatherStatus: string;
  windSpeed?: number | null;
  observedAt: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type AdminTrafficObservationPayload = {
  destinationId?: string | null;
  congestionLevel: number;
  status: string;
  description?: string | null;
  observedAt: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type AdminTimeSeriesPoint = {
  day: string;
  count: number;
};

export type AdminGroupedCount = {
  label: string;
  count: number;
};

export type AdminTrafficLevelCount = {
  label: number;
  count: number;
};

export type AdminWeatherStats = {
  avgHumidity: number | null;
  avgTemperature: number | null;
  byDay: AdminTimeSeriesPoint[];
  byProvince: AdminGroupedCount[];
  byStatus: AdminGroupedCount[];
  latestObservedAt: string | null;
  total: number;
};

export type AdminTrafficStats = {
  avgCongestionLevel: number | null;
  byDay: AdminTimeSeriesPoint[];
  byLevel: AdminTrafficLevelCount[];
  byProvince: AdminGroupedCount[];
  highRiskCount: number;
  latestObservedAt: string | null;
  total: number;
};

export type AdminDataCoverage = {
  destinations: number;
  freshnessHours: number;
  missingTraffic: number;
  missingWeather: number;
  trafficCovered: number;
  trafficFresh: number;
  trafficFreshRate: number;
  weatherCovered: number;
  weatherFresh: number;
  weatherFreshRate: number;
};

function buildAdminSearchParams(query?: AdminObservationQuery) {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

function toAdminListMeta(meta?: Record<string, unknown>): AdminListMeta {
  return {
    limit: Number(meta?.limit || 20),
    numberMatched: Number(meta?.numberMatched || meta?.total || 0),
    numberReturned: Number(meta?.numberReturned || 0),
    page: Number(meta?.page || 1),
    total: Number(meta?.total || meta?.numberMatched || 0),
  };
}

export function getAdminDashboardStats() {
  return fetchApi<AdminDashboardStats>("/admin/dashboard/stats");
}

export function getAdminWeatherStats(query?: AdminObservationQuery) {
  return fetchApi<AdminWeatherStats>(`/admin/dashboard/weather-stats${buildAdminSearchParams(query)}`);
}

export function getAdminTrafficStats(query?: AdminObservationQuery) {
  return fetchApi<AdminTrafficStats>(`/admin/dashboard/traffic-stats${buildAdminSearchParams(query)}`);
}

export function getAdminDataCoverage(freshnessHours = 24) {
  return fetchApi<AdminDataCoverage>(`/admin/dashboard/data-coverage?freshnessHours=${freshnessHours}`);
}

export function getAdminRouteDemand() {
  return fetchApi<AdminRouteDemand[]>("/admin/dashboard/route-demand");
}

export function getAdminDestinationMix() {
  return fetchApi<AdminDestinationMix[]>("/admin/dashboard/destination-mix");
}

export function getAdminDestinations() {
  return fetchApi<AdminDestination[]>("/admin/destinations");
}

export function getAdminDestination(id: string) {
  return fetchApi<AdminDestination>(`/admin/destinations/${id}`);
}

export function createAdminDestination(payload: AdminDestinationPayload) {
  return fetchApi<AdminDestination>("/admin/destinations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminDestination(id: string, payload: AdminDestinationPayload) {
  return fetchApi<AdminDestination>(`/admin/destinations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getAdminCategories() {
  return fetchApi<AdminCategory[]>("/admin/categories");
}

export function createAdminCategory(payload: AdminCategoryPayload) {
  return fetchApi<AdminCategory>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminCategory(id: string, payload: AdminCategoryPayload) {
  return fetchApi<AdminCategory>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminCategory(id: string) {
  return fetchApi<AdminCategory>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminProvinces() {
  const provinces = await fetchApi<GeoJsonFeatureCollection<AdminProvince>>("/geo/provinces");

  return provinces.features.map((feature) => feature.properties);
}

export function getAdminServices() {
  return fetchApi<AdminService[]>("/admin/services");
}

export function createAdminService(payload: AdminServicePayload) {
  return fetchApi<AdminService>("/admin/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminService(id: string, payload: AdminServicePayload) {
  return fetchApi<AdminService>(`/admin/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminService(id: string) {
  return fetchApi<AdminService>(`/admin/services/${id}`, {
    method: "DELETE",
  });
}

export function getAdminNotifications() {
  return fetchApi<AdminNotification[]>("/admin/notifications");
}

export function createAdminNotification(payload: AdminNotificationPayload) {
  return fetchApi<AdminNotification>("/admin/notifications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminNotification(id: string, payload: AdminNotificationPayload) {
  return fetchApi<AdminNotification>(`/admin/notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminNotification(id: string) {
  return fetchApi<AdminNotification>(`/admin/notifications/${id}`, {
    method: "DELETE",
  });
}

export function getAdminReviews() {
  return fetchApi<AdminReview[]>("/admin/reviews");
}

export function getAdminReview(id: string) {
  return fetchApi<AdminReview>(`/admin/reviews/${id}`);
}

export function moderateAdminReview(id: string, status: AdminReview["status"]) {
  return fetchApi<AdminReview>(`/admin/reviews/${id}/moderate`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getAdminWeatherObservations(query?: AdminObservationQuery) {
  const envelope = await fetchApiEnvelope<AdminWeatherObservation[]>(
    `/admin/weather${buildAdminSearchParams(query)}`,
  );

  return {
    items: envelope.data,
    meta: toAdminListMeta(envelope.meta),
  } satisfies AdminObservationList<AdminWeatherObservation>;
}

export function createAdminWeatherObservation(payload: AdminWeatherObservationPayload) {
  return fetchApi<AdminWeatherObservation>("/admin/weather", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminWeatherObservation(id: string, payload: AdminWeatherObservationPayload) {
  return fetchApi<AdminWeatherObservation>(`/admin/weather/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminWeatherObservation(id: string) {
  return fetchApi<AdminWeatherObservation>(`/admin/weather/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminTrafficObservations(query?: AdminObservationQuery) {
  const envelope = await fetchApiEnvelope<AdminTrafficObservation[]>(
    `/admin/traffic${buildAdminSearchParams(query)}`,
  );

  return {
    items: envelope.data,
    meta: toAdminListMeta(envelope.meta),
  } satisfies AdminObservationList<AdminTrafficObservation>;
}

export function createAdminTrafficObservation(payload: AdminTrafficObservationPayload) {
  return fetchApi<AdminTrafficObservation>("/admin/traffic", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminTrafficObservation(id: string, payload: AdminTrafficObservationPayload) {
  return fetchApi<AdminTrafficObservation>(`/admin/traffic/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminTrafficObservation(id: string) {
  return fetchApi<AdminTrafficObservation>(`/admin/traffic/${id}`, {
    method: "DELETE",
  });
}
