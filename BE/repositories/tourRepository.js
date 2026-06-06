import pool, { query } from "../config/db.js";
import { badRequest, notFound } from "../utils/apiError.js";

const TOUR_STATUSES = new Set(["draft", "planned", "active", "completed", "cancelled"]);
const TRAVEL_MODES = new Set(["car", "motorbike", "walk_transit"]);
const PACES = new Set(["compact", "balanced", "relaxed"]);

function toNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}

function optionalString(value, maxLength, fieldName) {
  if (value === undefined) return undefined;
  const normalized = String(value || "").trim();
  if (normalized.length > maxLength) {
    throw badRequest(`${fieldName} must be at most ${maxLength} characters`);
  }
  return normalized;
}

function optionalNumber(value, fieldName, { integer = false, min = 0, max } = {}) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized < min || (max !== undefined && normalized > max)) {
    throw badRequest(`${fieldName} is invalid`);
  }
  if (integer && !Number.isInteger(normalized)) {
    throw badRequest(`${fieldName} must be an integer`);
  }
  return normalized;
}

function optionalEnum(value, values, fieldName) {
  if (value === undefined) return undefined;
  const normalized = String(value);
  if (!values.has(normalized)) throw badRequest(`${fieldName} is invalid`);
  return normalized;
}

function normalizeDate(value, fieldName) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    throw badRequest(`${fieldName} must use YYYY-MM-DD`);
  }
  return String(value);
}

function normalizeTime(value, fieldName) {
  if (value === undefined || value === null || value === "") return null;
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(String(value))) {
    throw badRequest(`${fieldName} must use HH:mm`);
  }
  return String(value).slice(0, 5);
}

function normalizeStops(payload) {
  const rawStops = payload.stops;
  const rawDestinationIds = payload.destinationIds ?? payload.destination_ids;
  if (rawStops === undefined && rawDestinationIds === undefined) return undefined;

  const stops = Array.isArray(rawStops)
    ? rawStops
    : Array.isArray(rawDestinationIds)
      ? rawDestinationIds.map((destinationId) => ({ destinationId }))
      : null;

  if (!stops || stops.length === 0) throw badRequest("At least one destination is required");

  const normalized = stops.map((stop, index) => {
    const destinationId = String(stop.destinationId ?? stop.destination_id ?? "").trim();
    if (!destinationId) throw badRequest("Every stop requires destinationId");
    return {
      destinationId,
      dayNumber: optionalNumber(stop.dayNumber ?? stop.day_number ?? 1, "dayNumber", {
        integer: true,
        min: 1,
        max: 30,
      }),
      arrivalTime: normalizeTime(stop.arrivalTime ?? stop.arrival_time, "arrivalTime"),
      departureTime: normalizeTime(stop.departureTime ?? stop.departure_time, "departureTime"),
      stayMinutes: optionalNumber(stop.stayMinutes ?? stop.stay_minutes ?? 90, "stayMinutes", {
        integer: true,
        min: 15,
        max: 1440,
      }),
      estimatedCost: optionalNumber(stop.estimatedCost ?? stop.estimated_cost ?? 0, "estimatedCost", {
        min: 0,
      }),
      note: optionalString(stop.note, 500, "stop.note") || "",
      visitOrder: index + 1,
    };
  });

  if (new Set(normalized.map((stop) => stop.destinationId)).size !== normalized.length) {
    throw badRequest("A tour cannot include the same destination twice");
  }
  return normalized;
}

function normalizeLegs(rawLegs) {
  if (rawLegs === undefined) return undefined;
  if (!Array.isArray(rawLegs)) throw badRequest("legs must be an array");

  return rawLegs.map((leg, index) => ({
    fromDestinationId: String(leg.fromDestinationId ?? leg.from_destination_id ?? "").trim(),
    toDestinationId: String(leg.toDestinationId ?? leg.to_destination_id ?? "").trim(),
    travelMode: optionalEnum(leg.travelMode ?? leg.travel_mode ?? "car", TRAVEL_MODES, "leg.travelMode"),
    distanceKm: optionalNumber(leg.distanceKm ?? leg.distance_km, "leg.distanceKm", { min: 0 }),
    durationMinutes: optionalNumber(
      leg.durationMinutes ?? leg.duration_minutes,
      "leg.durationMinutes",
      { integer: true, min: 0 },
    ),
    title: optionalString(leg.title, 150, "leg.title") || "",
    note: optionalString(leg.note, 1000, "leg.note") || "",
    departureTime: normalizeTime(leg.departureTime ?? leg.departure_time, "leg.departureTime"),
    routeGeometry: leg.routeGeometry ?? leg.route_geometry ?? null,
    legOrder: index + 1,
  }));
}

function normalizeTourPayload(payload = {}, { partial = false } = {}) {
  const title = payload.title === undefined && payload.name === undefined
    ? undefined
    : String(payload.title ?? payload.name ?? "").trim();
  if ((!partial || title !== undefined) && (!title || title.length < 3 || title.length > 150)) {
    throw badRequest("title must be between 3 and 150 characters");
  }

  const startDate = normalizeDate(payload.startDate ?? payload.start_date, "startDate");
  const endDate = normalizeDate(payload.endDate ?? payload.end_date, "endDate");
  if (startDate && endDate && endDate < startDate) {
    throw badRequest("endDate cannot be before startDate");
  }

  const tour = {
    title,
    description: optionalString(payload.description, 1000, "description"),
    stops: normalizeStops(payload),
    legs: normalizeLegs(payload.legs),
    totalDistanceKm: optionalNumber(
      payload.totalDistanceKm ?? payload.total_distance_km,
      "totalDistanceKm",
      { min: 0 },
    ),
    estimatedDurationMinutes: optionalNumber(
      payload.estimatedDurationMinutes ?? payload.estimated_duration_minutes,
      "estimatedDurationMinutes",
      { integer: true, min: 0 },
    ),
    status: optionalEnum(payload.status, TOUR_STATUSES, "status"),
    startDate,
    endDate,
    partySize: optionalNumber(payload.partySize ?? payload.party_size, "partySize", {
      integer: true,
      min: 1,
      max: 100,
    }),
    budget: optionalNumber(payload.budget, "budget", { min: 0 }),
    travelMode: optionalEnum(payload.travelMode ?? payload.travel_mode, TRAVEL_MODES, "travelMode"),
    pace: optionalEnum(payload.pace, PACES, "pace"),
  };

  if (!partial && !tour.stops) throw badRequest("stops or destinationIds is required");
  return tour;
}

function mapTour(row) {
  const destinations = Array.isArray(row.destinations) ? row.destinations : [];
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    totalDistanceKm: toNumber(row.total_distance_km),
    estimatedDurationMinutes: row.estimated_duration_minutes,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    partySize: row.party_size,
    budget: toNumber(row.budget),
    travelMode: row.travel_mode,
    pace: row.pace,
    destinationIds: destinations.map((destination) => destination.id),
    destinations: destinations.map((destination) => ({
      id: destination.id,
      name: destination.name,
      visitOrder: destination.visitOrder,
      dayNumber: destination.dayNumber,
      arrivalTime: destination.arrivalTime,
      departureTime: destination.departureTime,
      stayMinutes: destination.stayMinutes,
      estimatedCost: toNumber(destination.estimatedCost) ?? 0,
      note: destination.note,
      ticketPrice: toNumber(destination.ticketPrice),
      imageUrl: destination.imageUrl,
      province: {
        id: destination.provinceId,
        name: destination.provinceName,
        code: destination.provinceCode,
      },
      category: destination.categoryId
        ? { id: destination.categoryId, name: destination.categoryName }
        : null,
      location: {
        latitude: toNumber(destination.latitude),
        longitude: toNumber(destination.longitude),
      },
    })),
    legs: (Array.isArray(row.legs) ? row.legs : []).map((leg) => ({
      id: leg.id,
      fromDestinationId: leg.fromDestinationId,
      toDestinationId: leg.toDestinationId,
      legOrder: leg.legOrder,
      travelMode: leg.travelMode,
      distanceKm: toNumber(leg.distanceKm),
      durationMinutes: leg.durationMinutes,
      title: leg.title,
      note: leg.note,
      departureTime: leg.departureTime,
      routeGeometry: leg.routeGeometry,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function assertDestinationsExist(client, destinationIds) {
  const result = await client.query(
    "SELECT id FROM tourist_destinations WHERE id = ANY($1::uuid[])",
    [destinationIds],
  );
  const foundIds = new Set(result.rows.map((row) => row.id));
  if (destinationIds.some((id) => !foundIds.has(id))) {
    throw badRequest("One or more destinationIds are invalid");
  }
}

async function replaceStops(client, tourId, stops) {
  await client.query("DELETE FROM tour_plan_details WHERE tour_plan_id = $1", [tourId]);
  for (const stop of stops) {
    await client.query(
      `INSERT INTO tour_plan_details (
         tour_plan_id, destination_id, visit_order, day_number, arrival_time,
         departure_time, stay_minutes, estimated_cost, note
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        tourId,
        stop.destinationId,
        stop.visitOrder,
        stop.dayNumber,
        stop.arrivalTime,
        stop.departureTime,
        stop.stayMinutes,
        stop.estimatedCost,
        stop.note || null,
      ],
    );
  }
}

async function replaceLegs(client, tourId, legs) {
  await client.query("DELETE FROM tour_plan_legs WHERE tour_plan_id = $1", [tourId]);
  for (const leg of legs || []) {
    if (!leg.fromDestinationId || !leg.toDestinationId) {
      throw badRequest("Every leg requires fromDestinationId and toDestinationId");
    }
    await client.query(
      `INSERT INTO tour_plan_legs (
         tour_plan_id, from_destination_id, to_destination_id, leg_order,
         travel_mode, distance_km, duration_minutes, title, note, departure_time,
         route_geometry
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        tourId,
        leg.fromDestinationId,
        leg.toDestinationId,
        leg.legOrder,
        leg.travelMode,
        leg.distanceKm,
        leg.durationMinutes,
        leg.title || null,
        leg.note || null,
        leg.departureTime,
        leg.routeGeometry,
      ],
    );
  }
}

async function findTours(userId, { id, q } = {}) {
  const params = [userId];
  const where = ["tp.user_id = $1"];
  if (id) {
    params.push(id);
    where.push(`tp.id = $${params.length}`);
  }
  if (q) {
    params.push(`%${String(q).trim()}%`);
    where.push(`(tp.title ILIKE $${params.length} OR tp.description ILIKE $${params.length})`);
  }

  const result = await query(
    `SELECT tp.*,
       COALESCE((
         SELECT json_agg(json_build_object(
           'id', d.id, 'name', d.name, 'visitOrder', tpd.visit_order,
           'dayNumber', tpd.day_number, 'arrivalTime', tpd.arrival_time,
           'departureTime', tpd.departure_time, 'stayMinutes', tpd.stay_minutes,
           'estimatedCost', tpd.estimated_cost, 'note', tpd.note,
           'ticketPrice', d.ticket_price, 'imageUrl', d.image_url,
           'provinceId', p.id, 'provinceName', p.name, 'provinceCode', p.code,
           'categoryId', c.id, 'categoryName', c.name,
           'latitude', ST_Y(d.location_geom), 'longitude', ST_X(d.location_geom)
         ) ORDER BY tpd.visit_order)
         FROM tour_plan_details tpd
         JOIN tourist_destinations d ON d.id = tpd.destination_id
         JOIN provinces p ON p.id = d.province_id
         LEFT JOIN destination_categories c ON c.id = d.category_id
         WHERE tpd.tour_plan_id = tp.id
       ), '[]'::json) AS destinations,
       COALESCE((
         SELECT json_agg(json_build_object(
           'id', tpl.id, 'fromDestinationId', tpl.from_destination_id,
           'toDestinationId', tpl.to_destination_id, 'legOrder', tpl.leg_order,
           'travelMode', tpl.travel_mode, 'distanceKm', tpl.distance_km,
           'durationMinutes', tpl.duration_minutes, 'title', tpl.title,
           'note', tpl.note, 'departureTime', tpl.departure_time,
           'routeGeometry', tpl.route_geometry
         ) ORDER BY tpl.leg_order)
         FROM tour_plan_legs tpl WHERE tpl.tour_plan_id = tp.id
       ), '[]'::json) AS legs
     FROM tour_plans tp
     WHERE ${where.join(" AND ")}
     ORDER BY tp.updated_at DESC`,
    params,
  );
  return result.rows.map(mapTour);
}

const TOUR_COLUMNS = [
  ["title", "title"],
  ["description", "description"],
  ["total_distance_km", "totalDistanceKm"],
  ["estimated_duration_minutes", "estimatedDurationMinutes"],
  ["status", "status"],
  ["start_date", "startDate"],
  ["end_date", "endDate"],
  ["party_size", "partySize"],
  ["budget", "budget"],
  ["travel_mode", "travelMode"],
  ["pace", "pace"],
];

export const tourRepository = {
  list(userId, queryParams = {}) {
    return findTours(userId, { q: queryParams.q });
  },

  async getByIdForUser(id, userId) {
    const tours = await findTours(userId, { id });
    if (tours.length === 0) throw notFound("Tour not found");
    return tours[0];
  },

  async create(userId, payload = {}) {
    const tour = normalizeTourPayload(payload);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await assertDestinationsExist(client, tour.stops.map((stop) => stop.destinationId));
      const result = await client.query(
        `INSERT INTO tour_plans (
          user_id, title, description, total_distance_km, estimated_duration_minutes,
          status, start_date, end_date, party_size, budget, travel_mode, pace
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
        [
          userId,
          tour.title,
          tour.description || null,
          tour.totalDistanceKm ?? null,
          tour.estimatedDurationMinutes ?? null,
          tour.status || "draft",
          tour.startDate ?? null,
          tour.endDate ?? null,
          tour.partySize ?? 1,
          tour.budget ?? null,
          tour.travelMode || "car",
          tour.pace || "balanced",
        ],
      );
      const tourId = result.rows[0].id;
      await replaceStops(client, tourId, tour.stops);
      await replaceLegs(client, tourId, tour.legs);
      await client.query("COMMIT");
      return this.getByIdForUser(tourId, userId);
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "22P02") throw badRequest("One or more IDs are invalid");
      throw error;
    } finally {
      client.release();
    }
  },

  async update(id, userId, payload = {}) {
    const tour = normalizeTourPayload(payload, { partial: true });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const existing = await client.query(
        "SELECT id FROM tour_plans WHERE id = $1 AND user_id = $2",
        [id, userId],
      );
      if (existing.rowCount === 0) throw notFound("Tour not found");

      const fields = [];
      const params = [id, userId];
      for (const [column, key] of TOUR_COLUMNS) {
        if (tour[key] !== undefined) {
          params.push(tour[key] === "" ? null : tour[key]);
          fields.push(`${column} = $${params.length}`);
        }
      }
      if (fields.length > 0) {
        await client.query(
          `UPDATE tour_plans SET ${fields.join(", ")}, updated_at = now()
           WHERE id = $1 AND user_id = $2`,
          params,
        );
      }
      if (tour.stops) {
        await assertDestinationsExist(client, tour.stops.map((stop) => stop.destinationId));
        await replaceStops(client, id, tour.stops);
      }
      if (tour.legs) await replaceLegs(client, id, tour.legs);
      if (fields.length === 0 && !tour.stops && !tour.legs) throw badRequest("No updates provided");
      await client.query("COMMIT");
      return this.getByIdForUser(id, userId);
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "22P02") throw badRequest("One or more IDs are invalid");
      throw error;
    } finally {
      client.release();
    }
  },

  async remove(id, userId) {
    const existing = await this.getByIdForUser(id, userId);
    await query("DELETE FROM tour_plans WHERE id = $1 AND user_id = $2", [id, userId]);
    return existing;
  },
};
