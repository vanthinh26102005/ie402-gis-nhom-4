import { query } from "../config/db.js";
import { badRequest, conflict, notFound } from "../utils/apiError.js";

function mapReview(row) {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    destinationId: row.destination_id,
    destinationName: row.destination_name,
    content: row.content,
    score: Number(row.score),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReviewSummary(row) {
  const totalReviews = Number(row.total_reviews || 0);
  const averageScore = row.average_score === null ? null : Number(row.average_score);
  const distribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: Number(row[`score_${score}_count`] || 0),
  }));

  return {
    averageScore,
    distribution,
    totalReviews,
  };
}

function normalizeStatus(status) {
  const statusMap = {
    approved: "published",
    hidden: "hidden",
    pending: "pending",
    published: "published",
    rejected: "hidden",
  };

  return statusMap[status];
}

function assertReviewPayload(payload = {}) {
  const destinationId = payload.destinationId || payload.destination_id;
  const score = Number(payload.score ?? payload.rating);
  const content = String(payload.content || "").trim();

  if (!destinationId) {
    throw badRequest("destinationId is required");
  }
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw badRequest("score must be an integer between 1 and 5");
  }
  if (content.length < 10 || content.length > 1000) {
    throw badRequest("content must be between 10 and 1000 characters");
  }

  return { content, destinationId, score };
}

function normalizeSort(sort) {
  const sortMap = {
    highest: "r.score DESC, r.updated_at DESC",
    latest: "r.updated_at DESC",
    lowest: "r.score ASC, r.updated_at DESC",
    relevant: "r.score DESC, r.updated_at DESC",
  };

  return sortMap[sort] || sortMap.relevant;
}

export const reviewRepository = {
  async list(queryParams = {}, { publicOnly = false } = {}) {
    const params = [];
    const where = [];

    if (publicOnly) {
      where.push("r.status = 'published'");
    } else if (queryParams.status) {
      const nextStatus = normalizeStatus(queryParams.status);
      if (!nextStatus) throw badRequest("status must be pending, published, approved, hidden, or rejected");
      params.push(nextStatus);
      where.push(`r.status = $${params.length}`);
    }

    if (queryParams.destinationId || queryParams.destination_id) {
      params.push(queryParams.destinationId || queryParams.destination_id);
      where.push(`r.destination_id = $${params.length}`);
    }

    if (queryParams.rating) {
      const rating = Number(queryParams.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw badRequest("rating must be an integer between 1 and 5");
      }
      params.push(rating);
      where.push(`r.score = $${params.length}`);
    }

    if (queryParams.q) {
      params.push(`%${String(queryParams.q).trim()}%`);
      where.push(`(r.content ILIKE $${params.length} OR u.full_name ILIKE $${params.length})`);
    }

    const orderBy = normalizeSort(queryParams.sort);

    const result = await query(
      `SELECT r.*, u.full_name AS user_name, d.name AS destination_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN tourist_destinations d ON d.id = r.destination_id
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY ${orderBy}`,
      params,
    );

    return result.rows.map(mapReview);
  },

  async summary(destinationId) {
    if (!destinationId) throw badRequest("destinationId is required");

    const result = await query(
      `SELECT
         COUNT(*) AS total_reviews,
         ROUND(AVG(score)::numeric, 1) AS average_score,
         COUNT(*) FILTER (WHERE score = 5) AS score_5_count,
         COUNT(*) FILTER (WHERE score = 4) AS score_4_count,
         COUNT(*) FILTER (WHERE score = 3) AS score_3_count,
         COUNT(*) FILTER (WHERE score = 2) AS score_2_count,
         COUNT(*) FILTER (WHERE score = 1) AS score_1_count
       FROM reviews
       WHERE destination_id = $1 AND status = 'published'`,
      [destinationId],
    );

    return mapReviewSummary(result.rows[0] || {});
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

    if (result.rowCount === 0) throw notFound("Review not found");
    return mapReview(result.rows[0]);
  },

  async create(userId, payload = {}) {
    const review = assertReviewPayload(payload);

    try {
      const result = await query(
        `INSERT INTO reviews (user_id, destination_id, content, score, status)
         VALUES ($1, $2, $3, $4, 'pending')
         RETURNING id`,
        [userId, review.destinationId, review.content, review.score],
      );

      return this.getById(result.rows[0].id);
    } catch (error) {
      if (error.code === "23505") {
        throw conflict("You have already reviewed this destination");
      }
      if (error.code === "23503") {
        throw badRequest("destinationId is invalid");
      }
      throw error;
    }
  },

  async moderate(id, payload = {}) {
    const nextStatus = normalizeStatus(payload.status);
    if (!nextStatus) throw badRequest("status must be pending, published, approved, hidden, or rejected");

    const result = await query(
      `UPDATE reviews SET status = $2 WHERE id = $1 RETURNING id`,
      [id, nextStatus],
    );

    if (result.rowCount === 0) throw notFound("Review not found");
    return this.getById(id);
  },
};
