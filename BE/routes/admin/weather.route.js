import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminWeatherController } from "../../controllers/adminObservationController.js";

const router = express.Router();

router.get("/admin/weather", asyncHandler(adminWeatherController.list));
router.get("/admin/weather/stats", asyncHandler(adminWeatherController.stats));
router.get("/admin/weather/:id", asyncHandler(adminWeatherController.detail));
router.post("/admin/weather", asyncHandler(adminWeatherController.create));
router.put("/admin/weather/:id", asyncHandler(adminWeatherController.update));
router.delete("/admin/weather/:id", asyncHandler(adminWeatherController.remove));

export default router;
