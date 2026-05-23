import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "../controllers/resourceController.js";
import { destinationService } from "../services/domainServices.js";

const router = express.Router();

const destinations = createResourceController(destinationService);

router.get("/destinations", asyncHandler(destinations.list));
router.get("/destinations/:id", asyncHandler(destinations.detail));

export default router;
