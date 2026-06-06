import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminTrafficController, coverage } from "../../controllers/adminObservationController.js";

const router = express.Router();

router.get("/admin/traffic", asyncHandler(adminTrafficController.list));
router.get("/admin/traffic/stats", asyncHandler(adminTrafficController.stats));
router.get("/admin/traffic/coverage", asyncHandler(coverage));
router.get("/admin/traffic/:id", asyncHandler(adminTrafficController.detail));
router.post("/admin/traffic", asyncHandler(adminTrafficController.create));
router.put("/admin/traffic/:id", asyncHandler(adminTrafficController.update));
router.delete("/admin/traffic/:id", asyncHandler(adminTrafficController.remove));

export default router;
