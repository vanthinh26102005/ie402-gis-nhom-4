import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { badRequest, conflict, unauthorized } from "../utils/apiError.js";
import { sendPasswordResetEmail } from "./emailService.js";

const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = "2h";
const REMEMBER_ACCESS_TOKEN_EXPIRES_IN = "30d";

export function toPublicUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    role: row.role,
    avatar: row.avatar,
    birthday: row.birthday,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function signAccessToken(user, rememberMe = false) {
  const expiresIn = rememberMe ? REMEMBER_ACCESS_TOKEN_EXPIRES_IN : DEFAULT_ACCESS_TOKEN_EXPIRES_IN;

  return {
    accessToken: jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "dev-jwt-secret-change-me",
      { expiresIn },
    ),
    expiresIn,
  };
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getCookieOptions(rememberMe = false) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
    path: "/",
  };
}

export async function register(payload) {
  const name = String(payload?.name || payload?.fullName || "").trim();
  const email = normalizeEmail(payload?.email);
  const password = String(payload?.password || "");
  const confirmPassword = String(payload?.confirmPassword || payload?.confirm_password || "");

  if (password !== confirmPassword) {
    throw badRequest("password and confirmPassword must match");
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount > 0) {
    throw conflict("email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));

  const result = await query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id, full_name, email, role, avatar, birthday, created_at, updated_at`,
    [name, email, passwordHash],
  );

  const user = toPublicUser(result.rows[0]);
  const token = signAccessToken(user);

  return {
    user,
    ...token,
  };
}

export async function login(payload) {
  const email = normalizeEmail(payload?.email);
  const password = String(payload?.password || "");
  const rememberMe = Boolean(payload?.rememberMe || payload?.remember_me);

  const result = await query(
    `SELECT id, full_name, email, password_hash, role, avatar, birthday, created_at, updated_at
     FROM users
     WHERE email = $1`,
    [email],
  );

  if (result.rowCount === 0) {
    throw unauthorized("Invalid email or password");
  }

  const row = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, row.password_hash);
  if (!isPasswordValid) {
    throw unauthorized("Invalid email or password");
  }

  const user = toPublicUser(row);
  const token = signAccessToken(user, rememberMe);

  return {
    user,
    rememberMe,
    ...token,
  };
}

export async function forgotPassword(payload) {
  const email = normalizeEmail(payload?.email);
  const result = await query("SELECT id, full_name, email FROM users WHERE email = $1", [email]);

  if (result.rowCount === 0) {
    return {
      message: "If the email exists, a password reset link has been sent.",
    };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(
    Date.now() + Number(process.env.RESET_PASSWORD_TOKEN_MINUTES || 15) * 60 * 1000,
  );

  await query(
    `UPDATE users
     SET reset_password_token_hash = $1,
         reset_password_expires_at = $2
     WHERE id = $3`,
    [tokenHash, expiresAt, result.rows[0].id],
  );

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${token}`;
  await sendPasswordResetEmail({
    to: result.rows[0].email,
    name: result.rows[0].full_name,
    resetUrl,
  });

  return {
    message: "If the email exists, a password reset link has been sent.",
  };
}

export async function resetPassword(token, payload) {
  const password = String(payload?.password || "");
  const confirmPassword = String(payload?.confirmPassword || payload?.confirm_password || "");

  if (password !== confirmPassword) {
    throw badRequest("password and confirmPassword must match");
  }

  const tokenHash = hashResetToken(token);
  const result = await query(
    `SELECT id
     FROM users
     WHERE reset_password_token_hash = $1
       AND reset_password_expires_at > now()`,
    [tokenHash],
  );

  if (result.rowCount === 0) {
    throw badRequest("reset token is invalid or expired");
  }

  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));

  await query(
    `UPDATE users
     SET password_hash = $1,
         reset_password_token_hash = NULL,
         reset_password_expires_at = NULL
     WHERE id = $2`,
    [passwordHash, result.rows[0].id],
  );

  return {
    message: "Password has been reset successfully.",
  };
}
