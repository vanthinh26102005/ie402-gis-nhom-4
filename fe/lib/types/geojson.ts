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
