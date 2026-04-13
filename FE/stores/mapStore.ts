import { create } from 'zustand';
import type { BBox, GeoJsonFeature } from '@/types/geo';

interface MapState {
  center: [number, number];
  zoom: number;
  bbox: BBox | null;
  selectedPlace: GeoJsonFeature | null;
  hoveredPlaceId: number | null;
  userLocation: [number, number] | null;

  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setBBox: (bbox: BBox) => void;
  setSelectedPlace: (place: GeoJsonFeature | null) => void;
  setHoveredPlaceId: (id: number | null) => void;
  setUserLocation: (location: [number, number] | null) => void;
  flyTo: (center: [number, number], zoom?: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [16.0, 108.0],
  zoom: 6,
  bbox: null,
  selectedPlace: null,
  hoveredPlaceId: null,
  userLocation: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBBox: (bbox) => set({ bbox }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setHoveredPlaceId: (id) => set({ hoveredPlaceId: id }),
  setUserLocation: (location) => set({ userLocation: location }),
  flyTo: (center, zoom) => set({ center, zoom: zoom ?? 14 }),
}));
