import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createResourceController } from "../../controllers/resourceController.js";
import { destinationService } from "../../services/domainServices.js";

const router = express.Router();

const destinations = createResourceController(destinationService);

router.get("/admin/destinations", asyncHandler(destinations.list));
router.get("/admin/destinations/:id", asyncHandler(destinations.detail));
router.post("/admin/destinations", asyncHandler(destinations.create));
router.put("/admin/destinations/:id", asyncHandler(destinations.update));
router.delete("/admin/destinations/:id", asyncHandler(destinations.remove));

export default router;
