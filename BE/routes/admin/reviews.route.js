import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as reviewController from "../../controllers/reviewController.js";

const router = express.Router();

router.get("/admin/reviews", asyncHandler(reviewController.list));
router.get("/admin/reviews/:id", asyncHandler(reviewController.detail));
router.patch(
  "/admin/reviews/:id/moderate",
  asyncHandler(reviewController.moderate),
);

export default router;
