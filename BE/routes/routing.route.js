import express from "express";
import { directions } from "../controllers/routingController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/routing/directions", asyncHandler(directions));

export default router;
