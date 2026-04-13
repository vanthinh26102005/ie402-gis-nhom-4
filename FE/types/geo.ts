export interface GeoJsonFeature {
  type: 'Feature';
  id: number;
  properties: Record<string, any>;
  geometry: {
    type: 'Point' | 'Polygon' | 'LineString' | 'MultiPolygon' | 'MultiLineString';
    coordinates: any;
  };
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export interface PlaceProperties {
  id: number;
  name: string;
  category: string;
  description: string | null;
  rating: number;
  featured: boolean;
  address: string | null;
  imageUrl: string | null;
  province: string | null;
  provinceId: number | null;
  distance?: number;
}

export interface ProvinceProperties {
  id: number;
  name: string;
  nameEn: string | null;
}

export interface RoadProperties {
  id: number;
  name: string;
  type: string;
}

export interface ServiceProperties {
  id: number;
  name: string;
  type: string;
  address: string | null;
  province: string | null;
  provinceId: number | null;
}

export interface BBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface PlacesQuery {
  bbox?: BBox;
  category?: string;
  search?: string;
  provinceId?: number;
  minRating?: number;
  featured?: boolean;
  limit?: number;
}

export interface ServicesQuery {
  bbox?: BBox;
  type?: string;
  provinceId?: number;
  limit?: number;
}

export interface NearbyQuery {
  lng: number;
  lat: number;
  radius?: number;
  limit?: number;
}

export interface GeoStats {
  places: number;
  provinces: number;
  roads: number;
  services: number;
}

export type PlaceCategory = 'temple' | 'museum' | 'beach' | 'nature' | 'market' | 'landmark' | 'pagoda' | 'park';
export type ServiceType = 'hotel' | 'restaurant' | 'hospital' | 'atm' | 'gas_station' | 'cafe';
export type RoadType = 'highway' | 'primary' | 'secondary';

export const CATEGORY_COLORS: Record<string, string> = {
  temple: '#e74c3c',
  museum: '#9b59b6',
  beach: '#3498db',
  nature: '#2ecc71',
  market: '#f39c12',
  landmark: '#e67e22',
  pagoda: '#e91e63',
  park: '#27ae60',
};

export const CATEGORY_ICONS: Record<string, string> = {
  temple: '🏛️',
  museum: '🏛️',
  beach: '🏖️',
  nature: '🌿',
  market: '🏪',
  landmark: '🏰',
  pagoda: '⛩️',
  park: '🌳',
};

export const SERVICE_ICONS: Record<string, string> = {
  hotel: '🏨',
  restaurant: '🍽️',
  hospital: '🏥',
  atm: '🏧',
  gas_station: '⛽',
  cafe: '☕',
};
