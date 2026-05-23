import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as reviewController from "../controllers/reviewController.js";

const router = express.Router();

router.get("/reviews", asyncHandler(reviewController.list));
router.post("/reviews", asyncHandler(reviewController.create));

export default router;
