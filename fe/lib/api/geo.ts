import { fetchApi } from "@/lib/api/client";
import type { DestinationFeatureProperties } from "@/lib/types/destination";
import type { GeoJsonFeatureCollection } from "@/lib/types/geojson";
import type { ServiceFeatureProperties } from "@/lib/types/service";

export async function fetchDestinationFeatures() {
  return fetchApi<GeoJsonFeatureCollection<DestinationFeatureProperties>>("/geo/destinations");
}

export async function fetchServiceFeatures() {
  return fetchApi<GeoJsonFeatureCollection<ServiceFeatureProperties>>("/geo/services");
}
