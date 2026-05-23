import express from "express";
import { health } from "../controllers/healthController.js";

import authRoutes from "./auth.route.js";
import usersRoutes from "./users.route.js";
import categoriesRoutes from "./categories.route.js";
import destinationsRoutes from "./destinations.route.js";
import servicesRoutes from "./services.route.js";
import toursRoutes from "./tours.route.js";
import reviewsRoutes from "./reviews.route.js";
import notificationsRoutes from "./notifications.route.js";
import weatherRoutes from "./weather.route.js";
import trafficRoutes from "./traffic.route.js";

import adminDestinations from "./admin/destinations.route.js";
import adminServices from "./admin/services.route.js";
import adminCategories from "./admin/categories.route.js";
import adminNotifications from "./admin/notifications.route.js";
import adminWeather from "./admin/weather.route.js";
import adminTraffic from "./admin/traffic.route.js";
import adminReviews from "./admin/reviews.route.js";

const router = express.Router();

router.get("/health", health);

// mounted sub-routers
router.use(authRoutes);
router.use(usersRoutes);
router.use(categoriesRoutes);
router.use(destinationsRoutes);
router.use(servicesRoutes);
router.use(toursRoutes);
router.use(reviewsRoutes);
router.use(notificationsRoutes);
router.use(weatherRoutes);
router.use(trafficRoutes);

// admin
router.use(adminDestinations);
router.use(adminServices);
router.use(adminCategories);
router.use(adminNotifications);
router.use(adminWeather);
router.use(adminTraffic);
router.use(adminReviews);

export default router;
