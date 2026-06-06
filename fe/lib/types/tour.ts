import type { TravelMode } from "@/lib/routing/estimate";

export type TourStatus = "draft" | "planned" | "active" | "completed" | "cancelled";
export type TourPace = "compact" | "balanced" | "relaxed";

export type TourStopInput = {
  destinationId: string;
  dayNumber: number;
  arrivalTime: string;
  departureTime: string;
  stayMinutes: number;
  estimatedCost: number;
  note: string;
};

export type TourLegInput = {
  fromDestinationId: string;
  toDestinationId: string;
  travelMode: TravelMode;
  distanceKm: number | null;
  durationMinutes: number | null;
  title?: string;
  note?: string;
  departureTime?: string | null;
  routeGeometry?: unknown;
};

export type CreateTourPayload = {
  title: string;
  description: string;
  stops: TourStopInput[];
  legs?: TourLegInput[];
  totalDistanceKm?: number | null;
  estimatedDurationMinutes?: number | null;
  status: TourStatus;
  startDate: string | null;
  endDate: string | null;
  partySize: number;
  budget: number | null;
  travelMode: TravelMode;
  pace: TourPace;
};

export type TourDestination = {
  id: string;
  name: string;
  visitOrder: number;
  dayNumber: number;
  arrivalTime: string | null;
  departureTime: string | null;
  stayMinutes: number;
  estimatedCost: number;
  note: string | null;
  ticketPrice: number | null;
  imageUrl: string | null;
  province: { id: string; name: string; code: string };
  category: { id: string; name: string } | null;
  location: { latitude: number; longitude: number };
};

export type TourLeg = TourLegInput & {
  id: string;
  legOrder: number;
};

export type CreatedTour = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  totalDistanceKm: number | null;
  estimatedDurationMinutes: number | null;
  status: TourStatus;
  startDate: string | null;
  endDate: string | null;
  partySize: number;
  budget: number | null;
  travelMode: TravelMode;
  pace: TourPace;
  destinationIds: string[];
  destinations: TourDestination[];
  legs: TourLeg[];
  createdAt: string;
  updatedAt: string;
};
