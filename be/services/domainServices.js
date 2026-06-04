import { badRequest } from "../utils/apiError.js";
import { createCrudService } from "./crudService.js";
import {
  adminCategoryRepository,
  adminDashboardRepository,
  adminDestinationRepository,
  adminReviewRepository,
  adminServiceRepository,
} from "../repositories/adminRepository.js";

export const categoryService = adminCategoryRepository;
export const destinationService = adminDestinationRepository;
export const serviceFacilityService = adminServiceRepository;
export const notificationService = createCrudService("notifications", "noti");
export const weatherService = createCrudService("weather", "weather");
export const trafficService = createCrudService("traffic", "traffic");

const tourCrud = createCrudService("tours", "tour");
const reviewCrud = adminReviewRepository;

export const tourService = {
  ...tourCrud,
  create(payload) {
    if (!payload?.title) {
      throw badRequest("title is required");
    }
    return tourCrud.create(payload);
  },
};

export const reviewService = {
  ...reviewCrud,
  create(payload) {
    const fallbackCrud = createCrudService("reviews", "rev");
    if (!payload?.destinationId || !payload?.content || payload?.score === undefined) {
      throw badRequest("destinationId, content and score are required");
    }
    return fallbackCrud.create({
      status: "pending",
      ...payload,
    });
  },
  moderate(id, payload) {
    if (!payload?.status) {
      throw badRequest("status is required");
    }
    return reviewCrud.moderate(id, {
      status: payload.status,
      moderationNote: payload.moderationNote || "",
    });
  },
};

export const adminDashboardService = adminDashboardRepository;
