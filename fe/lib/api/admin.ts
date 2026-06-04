import { fetchApi } from "@/lib/api/client";

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
  provinceName?: string;
  categoryName?: string | null;
  address?: string | null;
  ticketPrice?: number | null;
  rating?: number | null;
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
  provinceName?: string;
  address?: string | null;
  phone?: string | null;
  rating?: number | null;
  updatedAt?: string;
};

export type AdminReview = {
  id: string;
  userName: string;
  destinationName: string;
  content: string | null;
  score: number;
  status: "pending" | "published" | "hidden";
  updatedAt?: string;
};

export function getAdminDashboardStats() {
  return fetchApi<AdminDashboardStats>("/admin/dashboard/stats");
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

export function getAdminCategories() {
  return fetchApi<AdminCategory[]>("/admin/categories");
}

export function getAdminServices() {
  return fetchApi<AdminService[]>("/admin/services");
}

export function getAdminReviews() {
  return fetchApi<AdminReview[]>("/admin/reviews");
}

export function moderateAdminReview(id: string, status: AdminReview["status"]) {
  return fetchApi<AdminReview>(`/admin/reviews/${id}/moderate`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
