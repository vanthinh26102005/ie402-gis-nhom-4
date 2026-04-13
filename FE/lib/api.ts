import type {
  GeoJsonFeatureCollection,
  GeoJsonFeature,
  PlacesQuery,
  ServicesQuery,
  NearbyQuery,
  GeoStats,
} from '@/types/geo';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchApi<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const geoApi = {
  getProvinces: () => fetchApi<GeoJsonFeatureCollection>('/geo/provinces'),

  getPlaces: (query?: PlacesQuery) => {
    const params: Record<string, any> = {};
    if (query?.bbox) {
      params.minLng = query.bbox.minLng;
      params.minLat = query.bbox.minLat;
      params.maxLng = query.bbox.maxLng;
      params.maxLat = query.bbox.maxLat;
    }
    if (query?.category) params.category = query.category;
    if (query?.search) params.search = query.search;
    if (query?.provinceId) params.provinceId = query.provinceId;
    if (query?.minRating) params.minRating = query.minRating;
    if (query?.featured !== undefined) params.featured = query.featured;
    if (query?.limit) params.limit = query.limit;
    return fetchApi<GeoJsonFeatureCollection>('/geo/places', params);
  },

  getPlaceById: (id: number) => fetchApi<GeoJsonFeature>(`/geo/places/${id}`),

  getNearbyPlaces: (query: NearbyQuery) =>
    fetchApi<GeoJsonFeatureCollection>('/geo/places/nearby', query as any),

  getCategories: () => fetchApi<string[]>('/geo/places/categories'),

  getTrendingPlaces: () => fetchApi<any[]>('/geo/places/trending'),

  getRoads: (type?: string) =>
    fetchApi<GeoJsonFeatureCollection>('/geo/roads', type ? { type } : undefined),

  getServices: (query?: ServicesQuery) => {
    const params: Record<string, any> = {};
    if (query?.bbox) {
      params.minLng = query.bbox.minLng;
      params.minLat = query.bbox.minLat;
      params.maxLng = query.bbox.maxLng;
      params.maxLat = query.bbox.maxLat;
    }
    if (query?.type) params.type = query.type;
    if (query?.provinceId) params.provinceId = query.provinceId;
    if (query?.limit) params.limit = query.limit;
    return fetchApi<GeoJsonFeatureCollection>('/geo/services', params);
  },

  getServiceTypes: () => fetchApi<string[]>('/geo/services/types'),

  getStats: () => fetchApi<GeoStats>('/geo/stats'),
};
