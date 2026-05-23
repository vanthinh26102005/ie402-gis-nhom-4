-- Query helpers for map/GeoJSON APIs.

-- Destination FeatureCollection.
-- $1: province code or NULL
-- $2: category name or NULL
SELECT json_build_object(
  'type', 'FeatureCollection',
  'features', COALESCE(json_agg(feature), '[]'::json)
) AS geojson
FROM (
  SELECT json_build_object(
    'type', 'Feature',
    'geometry', ST_AsGeoJSON(d.location_geom)::json,
    'properties', json_build_object(
      'id', d.id,
      'name', d.name,
      'province', p.name,
      'provinceCode', p.code,
      'category', c.name,
      'rating', d.rating,
      'ticketPrice', d.ticket_price,
      'address', d.address
    )
  ) AS feature
  FROM tourist_destinations d
  JOIN provinces p ON p.id = d.province_id
  LEFT JOIN destination_categories c ON c.id = d.category_id
  WHERE ($1::text IS NULL OR p.code = $1)
    AND ($2::text IS NULL OR c.name = $2)
  ORDER BY p.name, d.name
) features;

-- Service FeatureCollection.
-- $1: province code or NULL
-- $2: service type or NULL
SELECT json_build_object(
  'type', 'FeatureCollection',
  'features', COALESCE(json_agg(feature), '[]'::json)
) AS geojson
FROM (
  SELECT json_build_object(
    'type', 'Feature',
    'geometry', ST_AsGeoJSON(s.location_geom)::json,
    'properties', json_build_object(
      'id', s.id,
      'name', s.name,
      'type', s.type,
      'province', p.name,
      'provinceCode', p.code,
      'rating', s.rating,
      'address', s.address,
      'phone', s.phone
    )
  ) AS feature
  FROM service_facilities s
  JOIN provinces p ON p.id = s.province_id
  WHERE ($1::text IS NULL OR p.code = $1)
    AND ($2::text IS NULL OR s.type = $2)
  ORDER BY p.name, s.type, s.name
) features;

-- Province FeatureCollection. Demo boundaries are rough rectangles.
SELECT json_build_object(
  'type', 'FeatureCollection',
  'features', COALESCE(json_agg(feature), '[]'::json)
) AS geojson
FROM (
  SELECT json_build_object(
    'type', 'Feature',
    'geometry', ST_AsGeoJSON(p.boundary_geom)::json,
    'properties', json_build_object(
      'id', p.id,
      'name', p.name,
      'code', p.code,
      'description', p.description
    )
  ) AS feature
  FROM provinces p
  WHERE p.boundary_geom IS NOT NULL
  ORDER BY p.name
) features;
