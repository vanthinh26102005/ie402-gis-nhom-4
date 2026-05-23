import express from "express";
import { listAlerts, listTraffic } from "../controllers/weatherTrafficController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/traffic", asyncHandler(listTraffic));
router.get("/traffic/alerts", asyncHandler(listAlerts));

export default router;
