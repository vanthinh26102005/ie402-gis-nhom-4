'use client';

import { useQuery } from '@tanstack/react-query';
import { geoApi } from '@/lib/api';
import { useMapStore } from '@/stores/mapStore';
import { useFilterStore } from '@/stores/filterStore';
import { useDebounce } from './useDebounce';

export function usePlaces() {
  const bbox = useMapStore((s) => s.bbox);
  const { search, category, minRating, showFeaturedOnly } = useFilterStore();
  const debouncedSearch = useDebounce(search, 400);

  return useQuery({
    queryKey: ['places', bbox, category, debouncedSearch, minRating, showFeaturedOnly],
    queryFn: () =>
      geoApi.getPlaces({
        bbox: bbox || undefined,
        category: category || undefined,
        search: debouncedSearch || undefined,
        minRating: minRating || undefined,
        featured: showFeaturedOnly || undefined,
        limit: 300,
      }),
    staleTime: 30000,
    enabled: true,
  });
}

export function useProvinces() {
  const layers = useFilterStore((s) => s.layers);
  return useQuery({
    queryKey: ['provinces'],
    queryFn: geoApi.getProvinces,
    staleTime: 300000,
    enabled: layers.provinces,
  });
}

export function useRoads() {
  const layers = useFilterStore((s) => s.layers);
  return useQuery({
    queryKey: ['roads'],
    queryFn: () => geoApi.getRoads(),
    staleTime: 300000,
    enabled: layers.roads,
  });
}

export function useServices() {
  const bbox = useMapStore((s) => s.bbox);
  const { serviceType } = useFilterStore();
  const layers = useFilterStore((s) => s.layers);

  return useQuery({
    queryKey: ['services', bbox, serviceType],
    queryFn: () =>
      geoApi.getServices({
        bbox: bbox || undefined,
        type: serviceType || undefined,
        limit: 200,
      }),
    staleTime: 30000,
    enabled: layers.services,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: geoApi.getCategories,
    staleTime: 600000,
  });
}

export function useServiceTypes() {
  return useQuery({
    queryKey: ['serviceTypes'],
    queryFn: geoApi.getServiceTypes,
    staleTime: 600000,
  });
}

export function useNearbyPlaces(lng: number | null, lat: number | null) {
  return useQuery({
    queryKey: ['nearby', lng, lat],
    queryFn: () => geoApi.getNearbyPlaces({ lng: lng!, lat: lat!, radius: 15, limit: 20 }),
    enabled: lng !== null && lat !== null,
    staleTime: 60000,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: geoApi.getStats,
    staleTime: 60000,
  });
}
