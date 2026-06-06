import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as reviewController from "../controllers/reviewController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/reviews/summary", asyncHandler(reviewController.summary));
router.get("/reviews", asyncHandler(reviewController.list));
router.post("/reviews", authenticate, asyncHandler(reviewController.create));

export default router;
