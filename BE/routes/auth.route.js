import express from "express";
import * as authController from "../controllers/authController.js";
import { validateBody } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const registerSchema = [
  {
    name: "name",
    required: true,
    type: "string",
    minLength: 2,
    maxLength: 120,
  },
  {
    name: "email",
    required: true,
    type: "string",
    email: true,
    maxLength: 150,
  },
  { name: "password", required: true, type: "string", minLength: 8 },
  {
    name: "confirmPassword",
    required: true,
    type: "string",
    equals: "password",
  },
];

const loginSchema = [
  { name: "email", required: true, type: "string", email: true },
  { name: "password", required: true, type: "string" },
];

const forgotPasswordSchema = [
  { name: "email", required: true, type: "string", email: true },
];

const resetPasswordSchema = [
  { name: "password", required: true, type: "string", minLength: 8 },
  {
    name: "confirmPassword",
    required: true,
    type: "string",
    equals: "password",
  },
];

router.post(
  "/auth/register",
  validateBody(registerSchema),
  asyncHandler(authController.register),
);
router.post(
  "/auth/login",
  validateBody(loginSchema),
  asyncHandler(authController.login),
);
router.post(
  "/auth/forgot-password",
  validateBody(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword),
);
router.patch(
  "/auth/reset-password/:token",
  validateBody(resetPasswordSchema),
  asyncHandler(authController.resetPassword),
);
router.post("/auth/logout", asyncHandler(authController.logout));

export default router;
