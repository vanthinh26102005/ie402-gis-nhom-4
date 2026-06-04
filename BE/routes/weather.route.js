import express from "express";
import { listWeather } from "../controllers/weatherTrafficController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/weather", asyncHandler(listWeather));

export default router;
