import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "../controllers/resourceController.js";
import { weatherService } from "../services/domainServices.js";

const router = express.Router();

const weather = createResourceController(weatherService);

router.get("/weather", asyncHandler(weather.list));

export default router;
