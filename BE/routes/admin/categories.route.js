import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createResourceController } from "../../controllers/resourceController.js";
import { categoryService } from "../../services/domainServices.js";

const router = express.Router();

const categories = createResourceController(categoryService);

router.get("/admin/categories", asyncHandler(categories.list));
router.get("/admin/categories/:id", asyncHandler(categories.detail));
router.post("/admin/categories", asyncHandler(categories.create));
router.put("/admin/categories/:id", asyncHandler(categories.update));
router.delete("/admin/categories/:id", asyncHandler(categories.remove));

export default router;
