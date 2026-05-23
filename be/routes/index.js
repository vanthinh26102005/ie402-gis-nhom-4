import express from "express";
import { health } from "../controllers/healthController.js";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import * as reviewController from "../controllers/reviewController.js";
import { createResourceController } from "../controllers/resourceController.js";
import {
  categoryService,
  destinationService,
  notificationService,
  serviceFacilityService,
  tourService,
  trafficService,
  weatherService,
} from "../services/domainServices.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const categories = createResourceController(categoryService);
const destinations = createResourceController(destinationService);
const notifications = createResourceController(notificationService);
const serviceFacilities = createResourceController(serviceFacilityService);
const tours = createResourceController(tourService);
const traffic = createResourceController(trafficService);
const weather = createResourceController(weatherService);

router.get("/health", health);

router.post("/auth/register", asyncHandler(authController.register));
router.post("/auth/login", asyncHandler(authController.login));
router.get("/users/me", asyncHandler(userController.me));

router.get("/categories", asyncHandler(categories.list));

router.get("/destinations", asyncHandler(destinations.list));
router.get("/destinations/:id", asyncHandler(destinations.detail));

router.get("/services", asyncHandler(serviceFacilities.list));

router.get("/tours", asyncHandler(tours.list));
router.post("/tours", asyncHandler(tours.create));
router.get("/tours/:id", asyncHandler(tours.detail));

router.get("/reviews", asyncHandler(reviewController.list));
router.post("/reviews", asyncHandler(reviewController.create));

router.get("/notifications", asyncHandler(notifications.list));
router.get("/weather", asyncHandler(weather.list));
router.get("/traffic", asyncHandler(traffic.list));

router.get("/admin/destinations", asyncHandler(destinations.list));
router.get("/admin/destinations/:id", asyncHandler(destinations.detail));
router.post("/admin/destinations", asyncHandler(destinations.create));
router.put("/admin/destinations/:id", asyncHandler(destinations.update));
router.delete("/admin/destinations/:id", asyncHandler(destinations.remove));

router.get("/admin/services", asyncHandler(serviceFacilities.list));
router.get("/admin/services/:id", asyncHandler(serviceFacilities.detail));
router.post("/admin/services", asyncHandler(serviceFacilities.create));
router.put("/admin/services/:id", asyncHandler(serviceFacilities.update));
router.delete("/admin/services/:id", asyncHandler(serviceFacilities.remove));

router.get("/admin/categories", asyncHandler(categories.list));
router.get("/admin/categories/:id", asyncHandler(categories.detail));
router.post("/admin/categories", asyncHandler(categories.create));
router.put("/admin/categories/:id", asyncHandler(categories.update));
router.delete("/admin/categories/:id", asyncHandler(categories.remove));

router.get("/admin/notifications", asyncHandler(notifications.list));
router.get("/admin/notifications/:id", asyncHandler(notifications.detail));
router.post("/admin/notifications", asyncHandler(notifications.create));
router.put("/admin/notifications/:id", asyncHandler(notifications.update));
router.delete("/admin/notifications/:id", asyncHandler(notifications.remove));

router.get("/admin/reviews", asyncHandler(reviewController.list));
router.get("/admin/reviews/:id", asyncHandler(reviewController.detail));
router.patch("/admin/reviews/:id/moderate", asyncHandler(reviewController.moderate));

router.get("/admin/weather", asyncHandler(weather.list));
router.get("/admin/weather/:id", asyncHandler(weather.detail));
router.post("/admin/weather", asyncHandler(weather.create));
router.put("/admin/weather/:id", asyncHandler(weather.update));
router.delete("/admin/weather/:id", asyncHandler(weather.remove));

router.get("/admin/traffic", asyncHandler(traffic.list));
router.get("/admin/traffic/:id", asyncHandler(traffic.detail));
router.post("/admin/traffic", asyncHandler(traffic.create));
router.put("/admin/traffic/:id", asyncHandler(traffic.update));
router.delete("/admin/traffic/:id", asyncHandler(traffic.remove));

export default router;
