import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createResourceController } from "../../controllers/resourceController.js";
import { serviceFacilityService } from "../../services/domainServices.js";

const router = express.Router();

const serviceFacilities = createResourceController(serviceFacilityService);

router.get("/admin/services", asyncHandler(serviceFacilities.list));
router.get("/admin/services/:id", asyncHandler(serviceFacilities.detail));
router.post("/admin/services", asyncHandler(serviceFacilities.create));
router.put("/admin/services/:id", asyncHandler(serviceFacilities.update));
router.delete("/admin/services/:id", asyncHandler(serviceFacilities.remove));

export default router;
