import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { unauthorized } from "../utils/apiError.js";
import { toPublicUser } from "../services/authService.js";

function getToken(req) {
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}

export async function authenticate(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      throw unauthorized();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-jwt-secret-change-me");
    const result = await query(
      `SELECT id, full_name, email, role, avatar, birthday, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [payload.sub],
    );

    if (result.rowCount === 0) {
      throw unauthorized("Invalid authentication token");
    }

    req.user = toPublicUser(result.rows[0]);
    req.auth = payload;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(unauthorized("Invalid or expired authentication token"));
    }

    return next(error);
  }
}

