import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createResourceController } from "../../controllers/resourceController.js";
import { weatherService } from "../../services/domainServices.js";

const router = express.Router();

const weather = createResourceController(weatherService);

router.get("/admin/weather", asyncHandler(weather.list));
router.get("/admin/weather/:id", asyncHandler(weather.detail));
router.post("/admin/weather", asyncHandler(weather.create));
router.put("/admin/weather/:id", asyncHandler(weather.update));
router.delete("/admin/weather/:id", asyncHandler(weather.remove));

export default router;
