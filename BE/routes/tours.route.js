import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import * as tourController from "../controllers/tourController.js";

const router = express.Router();

router.get("/tours", authenticate, asyncHandler(tourController.list));
router.post("/tours", authenticate, asyncHandler(tourController.create));
router.get("/tours/:id", authenticate, asyncHandler(tourController.detail));
router.put("/tours/:id", authenticate, asyncHandler(tourController.update));
router.delete("/tours/:id", authenticate, asyncHandler(tourController.remove));

export default router;
