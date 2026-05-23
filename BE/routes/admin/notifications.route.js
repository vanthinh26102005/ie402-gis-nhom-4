import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createResourceController } from "../../controllers/resourceController.js";
import { notificationService } from "../../services/domainServices.js";

const router = express.Router();

const notifications = createResourceController(notificationService);

router.get("/admin/notifications", asyncHandler(notifications.list));
router.get("/admin/notifications/:id", asyncHandler(notifications.detail));
router.post("/admin/notifications", asyncHandler(notifications.create));
router.put("/admin/notifications/:id", asyncHandler(notifications.update));
router.delete("/admin/notifications/:id", asyncHandler(notifications.remove));

export default router;
