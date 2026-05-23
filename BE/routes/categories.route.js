import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "../controllers/resourceController.js";
import { categoryService } from "../services/domainServices.js";

const router = express.Router();

const categories = createResourceController(categoryService);

router.get("/categories", asyncHandler(categories.list));

export default router;
