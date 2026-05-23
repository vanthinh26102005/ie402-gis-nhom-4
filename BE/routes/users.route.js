import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/users/me", authenticate, asyncHandler(userController.me));

export default router;
