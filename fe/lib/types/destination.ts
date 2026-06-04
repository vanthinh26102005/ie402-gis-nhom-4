import type { Coordinate, GeoJsonPoint } from "@/lib/types/geojson";

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
