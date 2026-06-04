import { query } from "../config/db.js";

function toNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}

export async function listLatestWeather() {
  const result = await query(
    `
      SELECT
        w.id AS weather_id,
        d.id AS destination_id,
        d.name AS destination_name,
        p.name AS province,
        w.temperature,
        w.humidity,
        w.weather_status,
        w.wind_speed,
        w.observed_at,
        ST_Y(w.location_geom) AS latitude,
        ST_X(w.location_geom) AS longitude,
        ST_AsGeoJSON(w.location_geom)::json AS geometry
      FROM weather_info w
      LEFT JOIN tourist_destinations d ON d.id = w.destination_id
      LEFT JOIN provinces p ON p.id = d.province_id
      WHERE w.observed_at = (
        SELECT max(w2.observed_at)
        FROM weather_info w2
        WHERE w2.destination_id IS NOT DISTINCT FROM w.destination_id
      )
      ORDER BY p.name NULLS LAST, d.name NULLS LAST, w.observed_at DESC
    `,
  );

  return result.rows.map((row) => ({
    weather_id: row.weather_id,
    destination_id: row.destination_id,
    destination_name: row.destination_name,
    province: row.province,
    temperature: toNumber(row.temperature),
    humidity: row.humidity,
    weather_status: row.weather_status,
    wind_speed: toNumber(row.wind_speed),
    observed_at: row.observed_at,
    location: {
      latitude: toNumber(row.latitude),
      longitude: toNumber(row.longitude),
    },
    geometry: row.geometry,
  }));
}

export async function listLatestTraffic() {
  const result = await query(
    `
      SELECT
        t.id AS traffic_id,
        d.id AS destination_id,
        d.name AS destination_name,
        p.name AS province,
        t.congestion_level,
        t.status,
        t.description,
        t.observed_at,
        ST_Y(t.location_geom) AS latitude,
        ST_X(t.location_geom) AS longitude,
        ST_AsGeoJSON(t.location_geom)::json AS geometry
      FROM traffic_info t
      LEFT JOIN tourist_destinations d ON d.id = t.destination_id
      LEFT JOIN provinces p ON p.id = d.province_id
      WHERE t.observed_at = (
        SELECT max(t2.observed_at)
        FROM traffic_info t2
        WHERE t2.destination_id IS NOT DISTINCT FROM t.destination_id
      )
      ORDER BY t.congestion_level DESC, p.name NULLS LAST, d.name NULLS LAST
    `,
  );

  return result.rows.map((row) => ({
    traffic_id: row.traffic_id,
    destination_id: row.destination_id,
    destination_name: row.destination_name,
    province: row.province,
    congestion_level: row.congestion_level,
    status: row.status,
    description: row.description,
    observed_at: row.observed_at,
    location: {
      latitude: toNumber(row.latitude),
      longitude: toNumber(row.longitude),
    },
    geometry: row.geometry,
  }));
}

export async function listTrafficAlerts() {
  const result = await query(
    `
      SELECT
        n.id,
        CASE
          WHEN n.type = 'warning' THEN 'Cảnh báo'
          WHEN n.type = 'maintenance' THEN 'Cấm đường'
          ELSE 'Thông báo'
        END AS level,
        n.title,
        n.content,
        n.created_at AS date
      FROM notifications n
      WHERE n.status = 'active'
        AND n.type IN ('warning', 'maintenance', 'event', 'news')
      ORDER BY
        CASE n.type
          WHEN 'warning' THEN 1
          WHEN 'maintenance' THEN 2
          ELSE 3
        END,
        n.created_at DESC
      LIMIT 10
    `,
  );

  return result.rows.map((row) => ({
    id: row.id,
    level: row.level,
    title: row.title,
    content: row.content,
    date: row.date,
  }));
}
