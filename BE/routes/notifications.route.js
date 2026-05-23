import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "../controllers/resourceController.js";
import { notificationService } from "../services/domainServices.js";

const router = express.Router();

const notifications = createResourceController(notificationService);

router.get("/notifications", asyncHandler(notifications.list));

export default router;
