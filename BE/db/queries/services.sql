-- Query helpers for service facility APIs.

-- List services with optional province/type filters.
-- $1: province code or NULL
-- $2: service type or NULL
SELECT
  s.id,
  s.name,
  s.type,
  s.address,
  s.phone,
  s.rating,
  s.description,
  p.id AS province_id,
  p.name AS province_name,
  p.code AS province_code,
  ST_X(s.location_geom) AS longitude,
  ST_Y(s.location_geom) AS latitude,
  ST_AsGeoJSON(s.location_geom)::json AS geometry,
  s.created_at,
  s.updated_at
FROM service_facilities s
JOIN provinces p ON p.id = s.province_id
WHERE ($1::text IS NULL OR p.code = $1)
  AND ($2::text IS NULL OR s.type = $2)
ORDER BY p.name, s.type, s.name;

-- Find nearest services from a coordinate.
-- $1: longitude
-- $2: latitude
-- $3: service type or NULL
-- $4: limit count
SELECT
  s.id,
  s.name,
  s.type,
  s.address,
  s.phone,
  s.rating,
  p.name AS province_name,
  ST_X(s.location_geom) AS longitude,
  ST_Y(s.location_geom) AS latitude,
  ROUND(
    ST_Distance(
      s.location_geom::geography,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
    )::numeric / 1000,
    2
  ) AS distance_km,
  ST_AsGeoJSON(s.location_geom)::json AS geometry
FROM service_facilities s
JOIN provinces p ON p.id = s.province_id
WHERE ($3::text IS NULL OR s.type = $3)
ORDER BY s.location_geom <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)
LIMIT COALESCE($4::integer, 10);

-- Find services near a destination.
-- $1: destination id
-- $2: radius in meters
-- $3: service type or NULL
SELECT
  s.id,
  s.name,
  s.type,
  s.address,
  s.phone,
  s.rating,
  ROUND(ST_Distance(s.location_geom::geography, d.location_geom::geography)::numeric / 1000, 2) AS distance_km,
  ST_AsGeoJSON(s.location_geom)::json AS geometry
FROM tourist_destinations d
JOIN service_facilities s ON ST_DWithin(
  s.location_geom::geography,
  d.location_geom::geography,
  COALESCE($2::integer, 10000)
)
WHERE d.id = $1
  AND ($3::text IS NULL OR s.type = $3)
ORDER BY s.location_geom <-> d.location_geom;
