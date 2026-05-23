-- Query helpers for tourist destination APIs.
-- Parameter style follows node-postgres: $1, $2, ...

-- List destinations with optional province/category filters.
-- $1: province code or NULL
-- $2: category name or NULL
SELECT
  d.id,
  d.name,
  d.description,
  d.address,
  d.open_time,
  d.close_time,
  d.ticket_price,
  d.image_url,
  d.video_url,
  d.rating,
  p.id AS province_id,
  p.name AS province_name,
  p.code AS province_code,
  c.id AS category_id,
  c.name AS category_name,
  ST_X(d.location_geom) AS longitude,
  ST_Y(d.location_geom) AS latitude,
  ST_AsGeoJSON(d.location_geom)::json AS geometry,
  d.created_at,
  d.updated_at
FROM tourist_destinations d
JOIN provinces p ON p.id = d.province_id
LEFT JOIN destination_categories c ON c.id = d.category_id
WHERE ($1::text IS NULL OR p.code = $1)
  AND ($2::text IS NULL OR c.name = $2)
ORDER BY p.name, d.name;

-- Get one destination with latest weather and traffic summaries.
-- $1: destination id
SELECT
  d.id,
  d.name,
  d.description,
  d.address,
  d.open_time,
  d.close_time,
  d.ticket_price,
  d.image_url,
  d.video_url,
  d.rating,
  p.name AS province_name,
  c.name AS category_name,
  ST_X(d.location_geom) AS longitude,
  ST_Y(d.location_geom) AS latitude,
  ST_AsGeoJSON(d.location_geom)::json AS geometry,
  latest_weather.weather,
  latest_traffic.traffic
FROM tourist_destinations d
JOIN provinces p ON p.id = d.province_id
LEFT JOIN destination_categories c ON c.id = d.category_id
LEFT JOIN LATERAL (
  SELECT json_build_object(
    'temperature', w.temperature,
    'humidity', w.humidity,
    'weatherStatus', w.weather_status,
    'windSpeed', w.wind_speed,
    'observedAt', w.observed_at
  ) AS weather
  FROM weather_info w
  WHERE w.destination_id = d.id
  ORDER BY w.observed_at DESC
  LIMIT 1
) latest_weather ON true
LEFT JOIN LATERAL (
  SELECT json_build_object(
    'congestionLevel', t.congestion_level,
    'status', t.status,
    'description', t.description,
    'observedAt', t.observed_at
  ) AS traffic
  FROM traffic_info t
  WHERE t.destination_id = d.id
  ORDER BY t.observed_at DESC
  LIMIT 1
) latest_traffic ON true
WHERE d.id = $1;

-- Search destinations by keyword.
-- $1: keyword, for example 'Hue'
SELECT
  d.id,
  d.name,
  p.name AS province_name,
  c.name AS category_name,
  d.rating,
  ST_AsGeoJSON(d.location_geom)::json AS geometry
FROM tourist_destinations d
JOIN provinces p ON p.id = d.province_id
LEFT JOIN destination_categories c ON c.id = d.category_id
WHERE d.name ILIKE '%' || $1 || '%'
   OR d.description ILIKE '%' || $1 || '%'
   OR d.address ILIKE '%' || $1 || '%'
ORDER BY d.rating DESC, d.name;
