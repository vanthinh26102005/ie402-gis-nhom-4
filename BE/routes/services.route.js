import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "../controllers/resourceController.js";
import { serviceFacilityService } from "../services/domainServices.js";

const router = express.Router();

const serviceFacilities = createResourceController(serviceFacilityService);

router.get("/services", asyncHandler(serviceFacilities.list));

export default router;
