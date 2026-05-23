-- Query helpers for weather and traffic APIs.

-- Latest weather for every destination.
SELECT
  d.id AS destination_id,
  d.name AS destination_name,
  p.name AS province_name,
  w.temperature,
  w.humidity,
  w.weather_status,
  w.wind_speed,
  w.observed_at,
  ST_X(w.location_geom) AS longitude,
  ST_Y(w.location_geom) AS latitude,
  ST_AsGeoJSON(w.location_geom)::json AS geometry
FROM tourist_destinations d
JOIN provinces p ON p.id = d.province_id
JOIN LATERAL (
  SELECT *
  FROM weather_info wi
  WHERE wi.destination_id = d.id
  ORDER BY wi.observed_at DESC
  LIMIT 1
) w ON true
ORDER BY p.name, d.name;

-- Latest traffic for every destination.
SELECT
  d.id AS destination_id,
  d.name AS destination_name,
  p.name AS province_name,
  t.congestion_level,
  t.status,
  t.description,
  t.observed_at,
  ST_X(t.location_geom) AS longitude,
  ST_Y(t.location_geom) AS latitude,
  ST_AsGeoJSON(t.location_geom)::json AS geometry
FROM tourist_destinations d
JOIN provinces p ON p.id = d.province_id
JOIN LATERAL (
  SELECT *
  FROM traffic_info ti
  WHERE ti.destination_id = d.id
  ORDER BY ti.observed_at DESC
  LIMIT 1
) t ON true
ORDER BY t.congestion_level DESC, p.name, d.name;

-- Weather observations inside a map viewport.
-- $1: min longitude
-- $2: min latitude
-- $3: max longitude
-- $4: max latitude
SELECT
  w.id,
  w.destination_id,
  w.temperature,
  w.humidity,
  w.weather_status,
  w.wind_speed,
  w.observed_at,
  ST_AsGeoJSON(w.location_geom)::json AS geometry
FROM weather_info w
WHERE w.location_geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)
ORDER BY w.observed_at DESC;

-- Traffic observations inside a map viewport.
-- $1: min longitude
-- $2: min latitude
-- $3: max longitude
-- $4: max latitude
SELECT
  t.id,
  t.destination_id,
  t.congestion_level,
  t.status,
  t.description,
  t.observed_at,
  ST_AsGeoJSON(t.location_geom)::json AS geometry
FROM traffic_info t
WHERE t.location_geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)
ORDER BY t.observed_at DESC;
