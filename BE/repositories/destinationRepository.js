import { query } from "../config/db.js";

function normalizePagination({ limit, offset } = {}) {
  const parsedLimit = Number(limit || 50);
  const parsedOffset = Number(offset || 0);

  return {
    limit: Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 50,
    offset: Number.isFinite(parsedOffset) ? Math.max(parsedOffset, 0) : 0,
  };
}

function toNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}

function toTime(value) {
  return value ? String(value).slice(0, 5) : null;
}

export function mapDestinationRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    address: row.address,
    openTime: toTime(row.open_time),
    closeTime: toTime(row.close_time),
    ticketPrice: toNumber(row.ticket_price),
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    rating: toNumber(row.rating),
    province: {
      id: row.province_id,
      name: row.province_name,
      code: row.province_code,
    },
    category: row.category_id || row.category_name
      ? {
          id: row.category_id,
          name: row.category_name,
        }
      : null,
    location: {
      latitude: toNumber(row.latitude),
      longitude: toNumber(row.longitude),
    },
    geometry: row.geometry,
    weather: row.weather || null,
    traffic: row.traffic || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listDestinations(filters = {}) {
  const { limit, offset } = normalizePagination(filters);
  const result = await query(
    `
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
        ST_Y(d.location_geom) AS latitude,
        ST_X(d.location_geom) AS longitude,
        ST_AsGeoJSON(d.location_geom)::json AS geometry,
        d.created_at,
        d.updated_at,
        count(*) OVER() AS total_count
      FROM tourist_destinations d
      JOIN provinces p ON p.id = d.province_id
      LEFT JOIN destination_categories c ON c.id = d.category_id
      WHERE ($1::text IS NULL OR d.name ILIKE '%' || $1 || '%'
          OR d.description ILIKE '%' || $1 || '%'
          OR d.address ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR p.code = $2)
        AND ($3::uuid IS NULL OR c.id = $3)
      ORDER BY p.name, d.name
      LIMIT $4 OFFSET $5
    `,
    [
      filters.q || null,
      filters.provinceCode || null,
      filters.categoryId || null,
      limit,
      offset,
    ],
  );

  return {
    items: result.rows.map(mapDestinationRow),
    total: result.rows[0] ? Number(result.rows[0].total_count) : 0,
    limit,
    offset,
  };
}

export async function getDestinationById(id) {
  const result = await query(
    `
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
        ST_Y(d.location_geom) AS latitude,
        ST_X(d.location_geom) AS longitude,
        ST_AsGeoJSON(d.location_geom)::json AS geometry,
        latest_weather.weather,
        latest_traffic.traffic,
        d.created_at,
        d.updated_at
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
      WHERE d.id = $1
    `,
    [id],
  );

  return result.rows[0] ? mapDestinationRow(result.rows[0]) : null;
}

export async function getDestinationCoordinates(id) {
  const result = await query(
    `
      SELECT
        d.id,
        d.name,
        ST_Y(d.location_geom) AS latitude,
        ST_X(d.location_geom) AS longitude
      FROM tourist_destinations d
      WHERE d.id = $1
    `,
    [id],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    label: row.name,
    latitude: toNumber(row.latitude),
    longitude: toNumber(row.longitude),
  };
}
