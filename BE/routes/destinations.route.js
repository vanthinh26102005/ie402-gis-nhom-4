import express from "express";
import { getDestination, listDestinations } from "../controllers/destinationController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/destinations", asyncHandler(listDestinations));
router.get("/destinations/:id", asyncHandler(getDestination));

export default router;
