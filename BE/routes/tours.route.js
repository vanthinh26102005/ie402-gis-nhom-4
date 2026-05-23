import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "../controllers/resourceController.js";
import { tourService } from "../services/domainServices.js";

const router = express.Router();

const tours = createResourceController(tourService);

router.get("/tours", asyncHandler(tours.list));
router.post("/tours", asyncHandler(tours.create));
router.get("/tours/:id", asyncHandler(tours.detail));

export default router;
