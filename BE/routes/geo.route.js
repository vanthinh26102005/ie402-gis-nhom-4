import express from "express";
import {
  destinationFeatures,
  provinceFeatures,
  serviceFeatures,
} from "../controllers/geoController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/geo/destinations", asyncHandler(destinationFeatures));
router.get("/geo/services", asyncHandler(serviceFeatures));
router.get("/geo/provinces", asyncHandler(provinceFeatures));

export default router;
