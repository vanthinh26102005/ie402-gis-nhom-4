import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as adminDashboardController from "../../controllers/adminDashboardController.js";

const router = express.Router();

router.get("/admin/dashboard/stats", asyncHandler(adminDashboardController.stats));
router.get("/admin/dashboard/route-demand", asyncHandler(adminDashboardController.routeDemand));
router.get("/admin/dashboard/destination-mix", asyncHandler(adminDashboardController.destinationMix));

export default router;
