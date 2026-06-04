import { query } from "../config/db.js";
import { badRequest, notFound } from "../utils/apiError.js";

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
}

function normalizeLocation(payload) {
  const lat = toNumberOrNull(payload?.location?.lat ?? payload?.lat ?? payload?.latitude);
  const lng = toNumberOrNull(payload?.location?.lng ?? payload?.lng ?? payload?.longitude);

  if (lat === null || lng === null) {
    throw badRequest("location.lat and location.lng are required");
  }

  return { lat, lng };
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    destinationsCount: Number(row.destinations_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDestination(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    address: row.address,
    openTime: row.open_time,
    closeTime: row.close_time,
    ticketPrice: row.ticket_price === null ? null : Number(row.ticket_price),
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    rating: row.rating === null ? null : Number(row.rating),
    provinceId: row.province_id,
    provinceName: row.province_name,
    provinceCode: row.province_code,
    categoryId: row.category_id,
    categoryName: row.category_name,
    location: {
      lat: Number(row.lat),
      lng: Number(row.lng),
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapService(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    address: row.address,
    phone: row.phone,
    rating: row.rating === null ? null : Number(row.rating),
    description: row.description,
    provinceId: row.province_id,
    provinceName: row.province_name,
    provinceCode: row.province_code,
    location: {
      lat: Number(row.lat),
      lng: Number(row.lng),
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReview(row) {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    destinationId: row.destination_id,
    destinationName: row.destination_name,
    content: row.content,
    score: row.score,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function single(result, message) {
  if (result.rowCount === 0) throw notFound(message);
  return result.rows[0];
}

export const adminCategoryRepository = {
  async list(queryParams = {}) {
    const params = [];
    const where = [];
    if (queryParams.q) {
      params.push(`%${queryParams.q}%`);
      where.push(`(c.name ILIKE $${params.length} OR c.description ILIKE $${params.length})`);
    }

    const result = await query(
      `SELECT c.*, COUNT(d.id) AS destinations_count
       FROM destination_categories c
       LEFT JOIN tourist_destinations d ON d.category_id = c.id
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       GROUP BY c.id
       ORDER BY c.name ASC`,
      params,
    );
    return result.rows.map(mapCategory);
  },

  async getById(id) {
    const result = await query(
      `SELECT c.*, COUNT(d.id) AS destinations_count
       FROM destination_categories c
       LEFT JOIN tourist_destinations d ON d.category_id = c.id
       WHERE c.id = $1
       GROUP BY c.id`,
      [id],
    );
    return mapCategory(await single(result, "Category not found"));
  },

  async create(payload) {
    const result = await query(
      `INSERT INTO destination_categories (name, description)
       VALUES ($1, $2)
       RETURNING *, 0 AS destinations_count`,
      [payload?.name, payload?.description || null],
    );
    return mapCategory(result.rows[0]);
  },

  async update(id, payload) {
    const current = await this.getById(id);
    const result = await query(
      `UPDATE destination_categories
       SET name = $2, description = $3
       WHERE id = $1
       RETURNING *, 0 AS destinations_count`,
      [
        id,
        payload?.name ?? current.name,
        payload?.description ?? current.description,
      ],
    );
    return mapCategory(await single(result, "Category not found"));
  },

  async remove(id) {
    const existing = await this.getById(id);
    await query(`DELETE FROM destination_categories WHERE id = $1`, [id]);
    return existing;
  },
};

const destinationSelect = `
  SELECT d.*,
         p.name AS province_name,
         p.code AS province_code,
         c.name AS category_name,
         ST_Y(d.location_geom) AS lat,
         ST_X(d.location_geom) AS lng
  FROM tourist_destinations d
  JOIN provinces p ON p.id = d.province_id
  LEFT JOIN destination_categories c ON c.id = d.category_id
`;

export const adminDestinationRepository = {
  async list(queryParams = {}) {
    const params = [];
    const where = [];
    if (queryParams.q) {
      params.push(`%${queryParams.q}%`);
      where.push(`(d.name ILIKE $${params.length} OR d.address ILIKE $${params.length} OR d.description ILIKE $${params.length})`);
    }
    if (queryParams.provinceId) {
      params.push(queryParams.provinceId);
      where.push(`d.province_id = $${params.length}`);
    }
    if (queryParams.categoryId) {
      params.push(queryParams.categoryId);
      where.push(`d.category_id = $${params.length}`);
    }

    const result = await query(
      `${destinationSelect}
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY d.updated_at DESC`,
      params,
    );
    return result.rows.map(mapDestination);
  },

  async getById(id) {
    const result = await query(`${destinationSelect} WHERE d.id = $1`, [id]);
    return mapDestination(await single(result, "Destination not found"));
  },

  async create(payload) {
    const location = normalizeLocation(payload);
    const result = await query(
      `INSERT INTO tourist_destinations (
         province_id, category_id, name, description, address, open_time, close_time,
         ticket_price, image_url, video_url, rating, location_geom
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 0), $9, $10, COALESCE($11, 0),
         ST_SetSRID(ST_MakePoint($12, $13), 4326)
       )
       RETURNING id`,
      [
        payload?.provinceId,
        payload?.categoryId || null,
        payload?.name,
        payload?.description || null,
        payload?.address || null,
        payload?.openTime || null,
        payload?.closeTime || null,
        toNumberOrNull(payload?.ticketPrice),
        payload?.imageUrl || null,
        payload?.videoUrl || null,
        toNumberOrNull(payload?.rating),
        location.lng,
        location.lat,
      ],
    );
    return this.getById(result.rows[0].id);
  },

  async update(id, payload) {
    const current = await this.getById(id);
    const location = payload?.location || payload?.lat || payload?.latitude ? normalizeLocation(payload) : current.location;
    const result = await query(
      `UPDATE tourist_destinations
       SET province_id = $2,
           category_id = $3,
           name = $4,
           description = $5,
           address = $6,
           open_time = $7,
           close_time = $8,
           ticket_price = $9,
           image_url = $10,
           video_url = $11,
           rating = $12,
           location_geom = ST_SetSRID(ST_MakePoint($13, $14), 4326)
       WHERE id = $1
       RETURNING id`,
      [
        id,
        payload?.provinceId ?? current.provinceId,
        payload?.categoryId ?? current.categoryId,
        payload?.name ?? current.name,
        payload?.description ?? current.description,
        payload?.address ?? current.address,
        payload?.openTime ?? current.openTime,
        payload?.closeTime ?? current.closeTime,
        payload?.ticketPrice ?? current.ticketPrice,
        payload?.imageUrl ?? current.imageUrl,
        payload?.videoUrl ?? current.videoUrl,
        payload?.rating ?? current.rating,
        location.lng,
        location.lat,
      ],
    );
    await single(result, "Destination not found");
    return this.getById(id);
  },

  async remove(id) {
    const existing = await this.getById(id);
    await query(`DELETE FROM tourist_destinations WHERE id = $1`, [id]);
    return existing;
  },
};

const serviceSelect = `
  SELECT s.*,
         p.name AS province_name,
         p.code AS province_code,
         ST_Y(s.location_geom) AS lat,
         ST_X(s.location_geom) AS lng
  FROM service_facilities s
  JOIN provinces p ON p.id = s.province_id
`;

export const adminServiceRepository = {
  async list(queryParams = {}) {
    const params = [];
    const where = [];
    if (queryParams.q) {
      params.push(`%${queryParams.q}%`);
      where.push(`(s.name ILIKE $${params.length} OR s.address ILIKE $${params.length} OR s.description ILIKE $${params.length})`);
    }
    if (queryParams.type) {
      params.push(queryParams.type);
      where.push(`s.type = $${params.length}`);
    }

    const result = await query(
      `${serviceSelect}
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY s.updated_at DESC`,
      params,
    );
    return result.rows.map(mapService);
  },

  async getById(id) {
    const result = await query(`${serviceSelect} WHERE s.id = $1`, [id]);
    return mapService(await single(result, "Service not found"));
  },

  async create(payload) {
    const location = normalizeLocation(payload);
    const result = await query(
      `INSERT INTO service_facilities (
         province_id, name, type, address, phone, rating, description, location_geom
       )
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 0), $7, ST_SetSRID(ST_MakePoint($8, $9), 4326))
       RETURNING id`,
      [
        payload?.provinceId,
        payload?.name,
        payload?.type,
        payload?.address || null,
        payload?.phone || null,
        toNumberOrNull(payload?.rating),
        payload?.description || null,
        location.lng,
        location.lat,
      ],
    );
    return this.getById(result.rows[0].id);
  },

  async update(id, payload) {
    const current = await this.getById(id);
    const location = payload?.location || payload?.lat || payload?.latitude ? normalizeLocation(payload) : current.location;
    const result = await query(
      `UPDATE service_facilities
       SET province_id = $2,
           name = $3,
           type = $4,
           address = $5,
           phone = $6,
           rating = $7,
           description = $8,
           location_geom = ST_SetSRID(ST_MakePoint($9, $10), 4326)
       WHERE id = $1
       RETURNING id`,
      [
        id,
        payload?.provinceId ?? current.provinceId,
        payload?.name ?? current.name,
        payload?.type ?? current.type,
        payload?.address ?? current.address,
        payload?.phone ?? current.phone,
        payload?.rating ?? current.rating,
        payload?.description ?? current.description,
        location.lng,
        location.lat,
      ],
    );
    await single(result, "Service not found");
    return this.getById(id);
  },

  async remove(id) {
    const existing = await this.getById(id);
    await query(`DELETE FROM service_facilities WHERE id = $1`, [id]);
    return existing;
  },
};

export const adminReviewRepository = {
  async list(queryParams = {}) {
    const params = [];
    const where = [];
    if (queryParams.status) {
      params.push(queryParams.status);
      where.push(`r.status = $${params.length}`);
    }

    const result = await query(
      `SELECT r.*, u.full_name AS user_name, d.name AS destination_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN tourist_destinations d ON d.id = r.destination_id
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY r.updated_at DESC`,
      params,
    );
    return result.rows.map(mapReview);
  },

  async getById(id) {
    const result = await query(
      `SELECT r.*, u.full_name AS user_name, d.name AS destination_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN tourist_destinations d ON d.id = r.destination_id
       WHERE r.id = $1`,
      [id],
    );
    return mapReview(await single(result, "Review not found"));
  },

  async moderate(id, payload) {
    const statusMap = {
      approved: "published",
      published: "published",
      hidden: "hidden",
      rejected: "hidden",
      pending: "pending",
    };
    const nextStatus = statusMap[payload?.status];
    if (!nextStatus) throw badRequest("status must be pending, published, approved, hidden, or rejected");

    await query(`UPDATE reviews SET status = $2 WHERE id = $1`, [id, nextStatus]);
    return this.getById(id);
  },
};

export const adminDashboardRepository = {
  async stats() {
    const result = await query(
      `SELECT
         (SELECT COUNT(*) FROM tourist_destinations) AS destinations,
         (SELECT COUNT(*) FROM service_facilities) AS services,
         (SELECT COUNT(*) FROM reviews) AS reviews,
         (SELECT COUNT(*) FROM reviews WHERE status = 'pending') AS pending_reviews,
         (SELECT COUNT(*) FROM notifications WHERE status = 'active') AS notifications,
         (SELECT COUNT(*) FROM tourist_destinations) AS active_destinations`,
    );
    const row = result.rows[0];
    return {
      destinations: Number(row.destinations),
      services: Number(row.services),
      reviews: Number(row.reviews),
      pendingReviews: Number(row.pending_reviews),
      notifications: Number(row.notifications),
      activeDestinations: Number(row.active_destinations),
    };
  },

  async routeDemand() {
    const result = await query(
      `SELECT p.name AS label, COUNT(d.id)::int AS count
       FROM provinces p
       LEFT JOIN tourist_destinations d ON d.province_id = p.id
       GROUP BY p.id
       ORDER BY count DESC`,
    );
    const max = Math.max(1, ...result.rows.map((row) => Number(row.count)));
    return result.rows.map((row) => ({
      label: row.label,
      value: Math.round((Number(row.count) / max) * 100),
    }));
  },

  async destinationMix() {
    const result = await query(
      `SELECT COALESCE(c.name, 'Khác') AS label, COUNT(d.id)::int AS count
       FROM tourist_destinations d
       LEFT JOIN destination_categories c ON c.id = d.category_id
       GROUP BY label
       ORDER BY count DESC`,
    );
    return result.rows.map((row) => ({ label: row.label, count: Number(row.count) }));
  },
};
