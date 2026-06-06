import { query } from "../config/db.js";
import { badRequest, notFound } from "../utils/apiError.js";

function toNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}

function normalizeLimit(limit, fallback = 500) {
  const parsed = Number(limit || fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), 1), 1000);
}

function normalizePage(page) {
  const parsed = Number(page || 1);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(Math.trunc(parsed), 1);
}

function normalizeAdminLimit(limit) {
  return Math.min(normalizeLimit(limit, 20), 100);
}

function toNullableNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw badRequest("Numeric fields must be valid numbers");
  return parsed;
}

function parseDateFilter(value, fieldName) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw badRequest(`${fieldName} must be a valid ISO date`);
  }
  return date.toISOString();
}

function parseTemporalFilters(queryParams = {}) {
  let from = queryParams.from;
  let to = queryParams.to;

  if (queryParams.datetime) {
    const [start, end] = String(queryParams.datetime).split("/");
    if (end !== undefined) {
      from = start && start !== ".." ? start : from;
      to = end && end !== ".." ? end : to;
    } else {
      to = queryParams.datetime;
    }
  }

  return {
    from: parseDateFilter(from, "from"),
    to: parseDateFilter(to, "to"),
  };
}

function parseBbox(bbox) {
  if (!bbox) return null;
  const parts = String(bbox).split(",").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
    throw badRequest("bbox must be minLng,minLat,maxLng,maxLat");
  }

  const [minLng, minLat, maxLng, maxLat] = parts;
  if (minLng >= maxLng || minLat >= maxLat) {
    throw badRequest("bbox minimum coordinates must be smaller than maximum coordinates");
  }

  return { maxLat, maxLng, minLat, minLng };
}

function parseLocation(payload = {}, { allowMissing = false } = {}) {
  const latitude = toNullableNumber(payload.location?.latitude ?? payload.location?.lat ?? payload.lat ?? payload.latitude);
  const longitude = toNullableNumber(payload.location?.longitude ?? payload.location?.lng ?? payload.lng ?? payload.longitude);

  if (latitude === null || longitude === null) {
    if (allowMissing) return null;
    throw badRequest("location latitude and longitude are required");
  }

  if (latitude < -90 || latitude > 90) throw badRequest("latitude must be between -90 and 90");
  if (longitude < -180 || longitude > 180) throw badRequest("longitude must be between -180 and 180");

  return { latitude, longitude };
}

function normalizeObservedAt(value, fallback) {
  const date = parseDateFilter(value || fallback || new Date().toISOString(), "observed_at");
  return date;
}

function assertUuidOrNull(value, fieldName) {
  if (!value) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value))) {
    throw badRequest(`${fieldName} must be a valid UUID`);
  }
  return value;
}

function mapWeatherRow(row) {
  return {
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
  };
}

function mapTrafficRow(row) {
  return {
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
  };
}

function buildTemporalWhere({ bbox, destinationId, from, tableAlias, to }) {
  const params = [];
  const where = [];

  if (destinationId) {
    params.push(destinationId);
    where.push(`${tableAlias}.destination_id = $${params.length}`);
  }

  if (from) {
    params.push(from);
    where.push(`${tableAlias}.observed_at >= $${params.length}::timestamptz`);
  }

  if (to) {
    params.push(to);
    where.push(`${tableAlias}.observed_at <= $${params.length}::timestamptz`);
  }

  if (bbox) {
    params.push(bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat);
    where.push(
      `${tableAlias}.location_geom && ST_MakeEnvelope($${params.length - 3}, $${params.length - 2}, $${params.length - 1}, $${params.length}, 4326)`,
    );
  }

  return {
    params,
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
  };
}

function buildAdminObservationWhere({ bbox, destinationId, from, provinceId, q, searchColumns, tableAlias, to }) {
  const base = buildTemporalWhere({ bbox, destinationId, from, tableAlias, to });
  const params = [...base.params];
  const where = base.whereSql ? [base.whereSql.replace(/^WHERE /, "")] : [];

  if (provinceId) {
    params.push(provinceId);
    where.push(`d.province_id = $${params.length}`);
  }

  if (q) {
    params.push(`%${q}%`);
    where.push(
      `(${[
        `d.name ILIKE $${params.length}`,
        `p.name ILIKE $${params.length}`,
        ...searchColumns.map((column) => `${column} ILIKE $${params.length}`),
      ].join(" OR ")})`,
    );
  }

  return {
    params,
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
  };
}

export async function listLatestWeather({ at } = {}) {
  const asOf = parseDateFilter(at, "at");
  const params = [];
  const asOfFilter = asOf ? "AND w2.observed_at <= $1::timestamptz" : "";
  if (asOf) params.push(asOf);

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
          ${asOfFilter}
      )
      ORDER BY p.name NULLS LAST, d.name NULLS LAST, w.observed_at DESC
    `,
    params,
  );

  return result.rows.map(mapWeatherRow);
}

export async function listWeatherObservations(queryParams = {}) {
  const bbox = parseBbox(queryParams.bbox);
  const { from, to } = parseTemporalFilters(queryParams);
  const limit = normalizeLimit(queryParams.limit);
  const { params, whereSql } = buildTemporalWhere({
    bbox,
    destinationId: queryParams.destinationId || queryParams.destination_id,
    from,
    tableAlias: "w",
    to,
  });
  params.push(limit);

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
      ${whereSql}
      ORDER BY w.observed_at ASC, p.name NULLS LAST, d.name NULLS LAST
      LIMIT $${params.length}
    `,
    params,
  );

  return result.rows.map(mapWeatherRow);
}

export async function listLatestTraffic({ at } = {}) {
  const asOf = parseDateFilter(at, "at");
  const params = [];
  const asOfFilter = asOf ? "AND t2.observed_at <= $1::timestamptz" : "";
  if (asOf) params.push(asOf);

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
          ${asOfFilter}
      )
      ORDER BY t.congestion_level DESC, p.name NULLS LAST, d.name NULLS LAST
    `,
    params,
  );

  return result.rows.map(mapTrafficRow);
}

export async function listTrafficObservations(queryParams = {}) {
  const bbox = parseBbox(queryParams.bbox);
  const { from, to } = parseTemporalFilters(queryParams);
  const limit = normalizeLimit(queryParams.limit);
  const { params, whereSql } = buildTemporalWhere({
    bbox,
    destinationId: queryParams.destinationId || queryParams.destination_id,
    from,
    tableAlias: "t",
    to,
  });
  params.push(limit);

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
      ${whereSql}
      ORDER BY t.observed_at ASC, t.congestion_level DESC, p.name NULLS LAST, d.name NULLS LAST
      LIMIT $${params.length}
    `,
    params,
  );

  return result.rows.map(mapTrafficRow);
}

export async function listAdminWeatherObservations(queryParams = {}) {
  const bbox = parseBbox(queryParams.bbox);
  const { from, to } = parseTemporalFilters(queryParams);
  const page = normalizePage(queryParams.page);
  const limit = normalizeAdminLimit(queryParams.limit);
  const offset = (page - 1) * limit;
  const { params, whereSql } = buildAdminObservationWhere({
    bbox,
    destinationId: queryParams.destinationId || queryParams.destination_id,
    from,
    provinceId: queryParams.provinceId || queryParams.province_id,
    q: queryParams.q,
    searchColumns: ["w.weather_status"],
    tableAlias: "w",
    to,
  });

  const countResult = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM weather_info w
      LEFT JOIN tourist_destinations d ON d.id = w.destination_id
      LEFT JOIN provinces p ON p.id = d.province_id
      ${whereSql}
    `,
    params,
  );

  const listParams = [...params, limit, offset];
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
      ${whereSql}
      ORDER BY w.observed_at DESC, p.name NULLS LAST, d.name NULLS LAST
      LIMIT $${listParams.length - 1}
      OFFSET $${listParams.length}
    `,
    listParams,
  );

  const total = Number(countResult.rows[0]?.total || 0);
  return {
    items: result.rows.map(mapWeatherRow),
    meta: {
      limit,
      numberMatched: total,
      numberReturned: result.rowCount,
      page,
      total,
    },
  };
}

export async function createWeatherObservation(payload = {}) {
  const location = parseLocation(payload);
  const destinationId = assertUuidOrNull(payload.destinationId || payload.destination_id, "destination_id");
  const humidity = toNullableNumber(payload.humidity);
  if (humidity !== null && (!Number.isInteger(humidity) || humidity < 0 || humidity > 100)) {
    throw badRequest("humidity must be an integer between 0 and 100");
  }
  if (!(payload.weatherStatus || payload.weather_status)) {
    throw badRequest("weather_status is required");
  }

  const result = await query(
    `
      INSERT INTO weather_info (
        destination_id, temperature, humidity, weather_status, wind_speed, location_geom, observed_at
      )
      VALUES (
        $1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8::timestamptz
      )
      RETURNING id
    `,
    [
      destinationId,
      toNullableNumber(payload.temperature),
      humidity,
      payload.weatherStatus || payload.weather_status || null,
      toNullableNumber(payload.windSpeed ?? payload.wind_speed),
      location.longitude,
      location.latitude,
      normalizeObservedAt(payload.observedAt || payload.observed_at),
    ],
  );

  return getWeatherObservationById(result.rows[0].id);
}

export async function updateWeatherObservation(id, payload = {}) {
  const current = await getWeatherObservationById(id);
  const location = parseLocation(payload, { allowMissing: true }) || current.location;
  const humidity = payload.humidity !== undefined ? toNullableNumber(payload.humidity) : current.humidity;
  if (humidity !== null && (!Number.isInteger(humidity) || humidity < 0 || humidity > 100)) {
    throw badRequest("humidity must be an integer between 0 and 100");
  }
  const destinationId =
    payload.destinationId !== undefined || payload.destination_id !== undefined
      ? assertUuidOrNull(payload.destinationId || payload.destination_id, "destination_id")
      : current.destination_id || null;

  const result = await query(
    `
      UPDATE weather_info
      SET destination_id = $2,
          temperature = $3,
          humidity = $4,
          weather_status = $5,
          wind_speed = $6,
          location_geom = ST_SetSRID(ST_MakePoint($7, $8), 4326),
          observed_at = $9::timestamptz
      WHERE id = $1
      RETURNING id
    `,
    [
      id,
      destinationId,
      payload.temperature !== undefined ? toNullableNumber(payload.temperature) : current.temperature,
      humidity,
      payload.weatherStatus ?? payload.weather_status ?? current.weather_status,
      payload.windSpeed !== undefined || payload.wind_speed !== undefined
        ? toNullableNumber(payload.windSpeed ?? payload.wind_speed)
        : current.wind_speed,
      location.longitude,
      location.latitude,
      normalizeObservedAt(payload.observedAt || payload.observed_at, current.observed_at),
    ],
  );

  if (result.rowCount === 0) throw notFound("Weather observation not found");
  return getWeatherObservationById(id);
}

export async function removeWeatherObservation(id) {
  const existing = await getWeatherObservationById(id);
  await query(`DELETE FROM weather_info WHERE id = $1`, [id]);
  return existing;
}

export async function listAdminTrafficObservations(queryParams = {}) {
  const bbox = parseBbox(queryParams.bbox);
  const { from, to } = parseTemporalFilters(queryParams);
  const page = normalizePage(queryParams.page);
  const limit = normalizeAdminLimit(queryParams.limit);
  const offset = (page - 1) * limit;
  const { params, whereSql } = buildAdminObservationWhere({
    bbox,
    destinationId: queryParams.destinationId || queryParams.destination_id,
    from,
    provinceId: queryParams.provinceId || queryParams.province_id,
    q: queryParams.q,
    searchColumns: ["t.status", "t.description"],
    tableAlias: "t",
    to,
  });

  const countResult = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM traffic_info t
      LEFT JOIN tourist_destinations d ON d.id = t.destination_id
      LEFT JOIN provinces p ON p.id = d.province_id
      ${whereSql}
    `,
    params,
  );

  const listParams = [...params, limit, offset];
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
      ${whereSql}
      ORDER BY t.observed_at DESC, t.congestion_level DESC, p.name NULLS LAST, d.name NULLS LAST
      LIMIT $${listParams.length - 1}
      OFFSET $${listParams.length}
    `,
    listParams,
  );

  const total = Number(countResult.rows[0]?.total || 0);
  return {
    items: result.rows.map(mapTrafficRow),
    meta: {
      limit,
      numberMatched: total,
      numberReturned: result.rowCount,
      page,
      total,
    },
  };
}

export async function createTrafficObservation(payload = {}) {
  const location = parseLocation(payload);
  const destinationId = assertUuidOrNull(payload.destinationId || payload.destination_id, "destination_id");
  const congestionLevel = Number(payload.congestionLevel ?? payload.congestion_level);
  if (!Number.isInteger(congestionLevel) || congestionLevel < 0 || congestionLevel > 5) {
    throw badRequest("congestion_level must be an integer between 0 and 5");
  }
  if (!payload.status) throw badRequest("status is required");

  const result = await query(
    `
      INSERT INTO traffic_info (
        destination_id, congestion_level, status, description, location_geom, observed_at
      )
      VALUES (
        $1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7::timestamptz
      )
      RETURNING id
    `,
    [
      destinationId,
      congestionLevel,
      payload.status,
      payload.description || null,
      location.longitude,
      location.latitude,
      normalizeObservedAt(payload.observedAt || payload.observed_at),
    ],
  );

  return getTrafficObservationById(result.rows[0].id);
}

export async function updateTrafficObservation(id, payload = {}) {
  const current = await getTrafficObservationById(id);
  const location = parseLocation(payload, { allowMissing: true }) || current.location;
  const destinationId =
    payload.destinationId !== undefined || payload.destination_id !== undefined
      ? assertUuidOrNull(payload.destinationId || payload.destination_id, "destination_id")
      : current.destination_id || null;
  const congestionLevel =
    payload.congestionLevel !== undefined || payload.congestion_level !== undefined
      ? Number(payload.congestionLevel ?? payload.congestion_level)
      : current.congestion_level;
  if (!Number.isInteger(congestionLevel) || congestionLevel < 0 || congestionLevel > 5) {
    throw badRequest("congestion_level must be an integer between 0 and 5");
  }

  const result = await query(
    `
      UPDATE traffic_info
      SET destination_id = $2,
          congestion_level = $3,
          status = $4,
          description = $5,
          location_geom = ST_SetSRID(ST_MakePoint($6, $7), 4326),
          observed_at = $8::timestamptz
      WHERE id = $1
      RETURNING id
    `,
    [
      id,
      destinationId,
      congestionLevel,
      payload.status ?? current.status,
      payload.description ?? current.description,
      location.longitude,
      location.latitude,
      normalizeObservedAt(payload.observedAt || payload.observed_at, current.observed_at),
    ],
  );

  if (result.rowCount === 0) throw notFound("Traffic observation not found");
  return getTrafficObservationById(id);
}

export async function removeTrafficObservation(id) {
  const existing = await getTrafficObservationById(id);
  await query(`DELETE FROM traffic_info WHERE id = $1`, [id]);
  return existing;
}

export async function getWeatherObservationStats(queryParams = {}) {
  const { from, to } = parseTemporalFilters(queryParams);
  const params = [];
  const where = [];
  if (from) {
    params.push(from);
    where.push(`w.observed_at >= $${params.length}::timestamptz`);
  }
  if (to) {
    params.push(to);
    where.push(`w.observed_at <= $${params.length}::timestamptz`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [summaryResult, dailyResult, statusResult, provinceResult] = await Promise.all([
    query(
      `
        SELECT COUNT(*)::int AS total,
               max(observed_at) AS latest_observed_at,
               avg(temperature)::numeric(5,2) AS avg_temperature,
               avg(humidity)::numeric(5,2) AS avg_humidity
        FROM weather_info w
        ${whereSql}
      `,
      params,
    ),
    query(
      `
        SELECT date_trunc('day', w.observed_at)::date AS day, COUNT(*)::int AS count
        FROM weather_info w
        ${whereSql}
        GROUP BY day
        ORDER BY day ASC
      `,
      params,
    ),
    query(
      `
        SELECT COALESCE(w.weather_status, 'Khác') AS label, COUNT(*)::int AS count
        FROM weather_info w
        ${whereSql}
        GROUP BY label
        ORDER BY count DESC
      `,
      params,
    ),
    query(
      `
        SELECT COALESCE(p.name, 'Chưa gắn điểm đến') AS label, COUNT(w.id)::int AS count
        FROM weather_info w
        LEFT JOIN tourist_destinations d ON d.id = w.destination_id
        LEFT JOIN provinces p ON p.id = d.province_id
        ${whereSql}
        GROUP BY label
        ORDER BY count DESC
      `,
      params,
    ),
  ]);

  const summary = summaryResult.rows[0] || {};
  return {
    avgHumidity: summary.avg_humidity === null ? null : Number(summary.avg_humidity),
    avgTemperature: summary.avg_temperature === null ? null : Number(summary.avg_temperature),
    byDay: dailyResult.rows.map((row) => ({ day: row.day, count: Number(row.count) })),
    byProvince: provinceResult.rows.map((row) => ({ label: row.label, count: Number(row.count) })),
    byStatus: statusResult.rows.map((row) => ({ label: row.label, count: Number(row.count) })),
    latestObservedAt: summary.latest_observed_at || null,
    total: Number(summary.total || 0),
  };
}

export async function getTrafficObservationStats(queryParams = {}) {
  const { from, to } = parseTemporalFilters(queryParams);
  const params = [];
  const where = [];
  if (from) {
    params.push(from);
    where.push(`t.observed_at >= $${params.length}::timestamptz`);
  }
  if (to) {
    params.push(to);
    where.push(`t.observed_at <= $${params.length}::timestamptz`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [summaryResult, dailyResult, levelResult, provinceResult] = await Promise.all([
    query(
      `
        SELECT COUNT(*)::int AS total,
               max(observed_at) AS latest_observed_at,
               avg(congestion_level)::numeric(5,2) AS avg_congestion_level,
               COUNT(*) FILTER (WHERE congestion_level >= 3)::int AS high_risk_count
        FROM traffic_info t
        ${whereSql}
      `,
      params,
    ),
    query(
      `
        SELECT date_trunc('day', t.observed_at)::date AS day, COUNT(*)::int AS count
        FROM traffic_info t
        ${whereSql}
        GROUP BY day
        ORDER BY day ASC
      `,
      params,
    ),
    query(
      `
        SELECT t.congestion_level AS label, COUNT(*)::int AS count
        FROM traffic_info t
        ${whereSql}
        GROUP BY t.congestion_level
        ORDER BY t.congestion_level ASC
      `,
      params,
    ),
    query(
      `
        SELECT COALESCE(p.name, 'Chưa gắn điểm đến') AS label, COUNT(t.id)::int AS count
        FROM traffic_info t
        LEFT JOIN tourist_destinations d ON d.id = t.destination_id
        LEFT JOIN provinces p ON p.id = d.province_id
        ${whereSql}
        GROUP BY label
        ORDER BY count DESC
      `,
      params,
    ),
  ]);

  const summary = summaryResult.rows[0] || {};
  return {
    avgCongestionLevel: summary.avg_congestion_level === null ? null : Number(summary.avg_congestion_level),
    byDay: dailyResult.rows.map((row) => ({ day: row.day, count: Number(row.count) })),
    byLevel: levelResult.rows.map((row) => ({ label: Number(row.label), count: Number(row.count) })),
    byProvince: provinceResult.rows.map((row) => ({ label: row.label, count: Number(row.count) })),
    highRiskCount: Number(summary.high_risk_count || 0),
    latestObservedAt: summary.latest_observed_at || null,
    total: Number(summary.total || 0),
  };
}

export async function getObservationCoverage(queryParams = {}) {
  const freshnessHours = Number(queryParams.freshnessHours || queryParams.freshness_hours || 24);
  const hours = Number.isFinite(freshnessHours) ? Math.min(Math.max(Math.trunc(freshnessHours), 1), 720) : 24;
  const result = await query(
    `
      WITH latest_weather AS (
        SELECT destination_id, max(observed_at) AS latest_observed_at
        FROM weather_info
        WHERE destination_id IS NOT NULL
        GROUP BY destination_id
      ),
      latest_traffic AS (
        SELECT destination_id, max(observed_at) AS latest_observed_at
        FROM traffic_info
        WHERE destination_id IS NOT NULL
        GROUP BY destination_id
      )
      SELECT
        COUNT(d.id)::int AS destinations,
        COUNT(lw.destination_id)::int AS weather_covered,
        COUNT(lt.destination_id)::int AS traffic_covered,
        COUNT(*) FILTER (WHERE lw.latest_observed_at >= now() - ($1::int * interval '1 hour'))::int AS weather_fresh,
        COUNT(*) FILTER (WHERE lt.latest_observed_at >= now() - ($1::int * interval '1 hour'))::int AS traffic_fresh
      FROM tourist_destinations d
      LEFT JOIN latest_weather lw ON lw.destination_id = d.id
      LEFT JOIN latest_traffic lt ON lt.destination_id = d.id
    `,
    [hours],
  );

  const row = result.rows[0];
  const destinations = Number(row.destinations || 0);
  const weatherCovered = Number(row.weather_covered || 0);
  const trafficCovered = Number(row.traffic_covered || 0);
  const weatherFresh = Number(row.weather_fresh || 0);
  const trafficFresh = Number(row.traffic_fresh || 0);

  return {
    destinations,
    freshnessHours: hours,
    missingTraffic: Math.max(destinations - trafficCovered, 0),
    missingWeather: Math.max(destinations - weatherCovered, 0),
    trafficCovered,
    trafficFresh,
    trafficFreshRate: destinations ? Math.round((trafficFresh / destinations) * 100) : 0,
    weatherCovered,
    weatherFresh,
    weatherFreshRate: destinations ? Math.round((weatherFresh / destinations) * 100) : 0,
  };
}

export async function getWeatherObservationById(id) {
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
      WHERE w.id = $1
    `,
    [id],
  );

  if (result.rowCount === 0) throw notFound("Weather observation not found");
  return mapWeatherRow(result.rows[0]);
}

export async function getTrafficObservationById(id) {
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
      WHERE t.id = $1
    `,
    [id],
  );

  if (result.rowCount === 0) throw notFound("Traffic observation not found");
  return mapTrafficRow(result.rows[0]);
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
