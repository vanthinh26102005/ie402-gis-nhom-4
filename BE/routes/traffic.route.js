import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "../controllers/resourceController.js";
import { trafficService } from "../services/domainServices.js";

const router = express.Router();

const traffic = createResourceController(trafficService);

router.get("/traffic", asyncHandler(traffic.list));

export default router;
