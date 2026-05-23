import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createResourceController } from "../../controllers/resourceController.js";
import { trafficService } from "../../services/domainServices.js";

const router = express.Router();

const traffic = createResourceController(trafficService);

router.get("/admin/traffic", asyncHandler(traffic.list));
router.get("/admin/traffic/:id", asyncHandler(traffic.detail));
router.post("/admin/traffic", asyncHandler(traffic.create));
router.put("/admin/traffic/:id", asyncHandler(traffic.update));
router.delete("/admin/traffic/:id", asyncHandler(traffic.remove));

export default router;
