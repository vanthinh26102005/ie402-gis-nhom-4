import { badRequest } from "../utils/apiError.js";
import { createCrudService } from "./crudService.js";

export const categoryService = createCrudService("categories", "cat");
export const destinationService = createCrudService("destinations", "dest");
export const serviceFacilityService = createCrudService("services", "svc");
export const notificationService = createCrudService("notifications", "noti");
export const weatherService = createCrudService("weather", "weather");
export const trafficService = createCrudService("traffic", "traffic");

const tourCrud = createCrudService("tours", "tour");
const reviewCrud = createCrudService("reviews", "rev");

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
    if (!payload?.destinationId || !payload?.content || payload?.score === undefined) {
      throw badRequest("destinationId, content and score are required");
    }
    return reviewCrud.create({
      status: "pending",
      ...payload,
    });
  },
  moderate(id, payload) {
    if (!payload?.status) {
      throw badRequest("status is required");
    }
    return reviewCrud.update(id, {
      status: payload.status,
      moderationNote: payload.moderationNote || "",
    });
  },
};
