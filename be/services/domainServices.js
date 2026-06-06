import { badRequest } from "../utils/apiError.js";
import { createCrudService } from "./crudService.js";
import {
  adminCategoryRepository,
  adminDashboardRepository,
  adminDestinationRepository,
  adminServiceRepository,
} from "../repositories/adminRepository.js";
import { reviewRepository } from "../repositories/reviewRepository.js";
import { tourRepository } from "../repositories/tourRepository.js";
import {
  createTrafficObservation,
  createWeatherObservation,
  getObservationCoverage,
  getTrafficObservationById,
  getTrafficObservationStats,
  getWeatherObservationById,
  getWeatherObservationStats,
  listAdminTrafficObservations,
  listAdminWeatherObservations,
  removeTrafficObservation,
  removeWeatherObservation,
  updateTrafficObservation,
  updateWeatherObservation,
} from "../repositories/weatherTrafficRepository.js";

export const categoryService = adminCategoryRepository;
export const destinationService = adminDestinationRepository;
export const serviceFacilityService = adminServiceRepository;
export const notificationService = createCrudService("notifications", "noti");
export const weatherService = {
  list(query) {
    return listAdminWeatherObservations(query);
  },
  getById(id) {
    return getWeatherObservationById(id);
  },
  create(payload) {
    return createWeatherObservation(payload);
  },
  update(id, payload) {
    return updateWeatherObservation(id, payload);
  },
  remove(id) {
    return removeWeatherObservation(id);
  },
  stats(query) {
    return getWeatherObservationStats(query);
  },
};
export const trafficService = {
  list(query) {
    return listAdminTrafficObservations(query);
  },
  getById(id) {
    return getTrafficObservationById(id);
  },
  create(payload) {
    return createTrafficObservation(payload);
  },
  update(id, payload) {
    return updateTrafficObservation(id, payload);
  },
  remove(id) {
    return removeTrafficObservation(id);
  },
  stats(query) {
    return getTrafficObservationStats(query);
  },
};
export const observationCoverageService = {
  get(query) {
    return getObservationCoverage(query);
  },
};
export const tourService = {
  list(userId, query) {
    if (!userId) throw badRequest("userId is required");
    return tourRepository.list(userId, query);
  },
  getById(id, userId) {
    if (!userId) throw badRequest("userId is required");
    return tourRepository.getByIdForUser(id, userId);
  },
  create(userId, payload) {
    if (!userId) throw badRequest("userId is required");
    return tourRepository.create(userId, payload);
  },
  update(id, userId, payload) {
    if (!userId) throw badRequest("userId is required");
    return tourRepository.update(id, userId, payload);
  },
  remove(id, userId) {
    if (!userId) throw badRequest("userId is required");
    return tourRepository.remove(id, userId);
  },
};

export const reviewService = {
  list(query, options) {
    return reviewRepository.list(query, options);
  },
  summary(destinationId) {
    return reviewRepository.summary(destinationId);
  },
  getById(id) {
    return reviewRepository.getById(id);
  },
  create(userId, payload) {
    if (!userId) {
      throw badRequest("userId is required");
    }
    return reviewRepository.create(userId, payload);
  },
  moderate(id, payload) {
    return reviewRepository.moderate(id, payload);
  },
};

export const adminDashboardService = adminDashboardRepository;
