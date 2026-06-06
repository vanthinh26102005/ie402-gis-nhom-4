import {
  observationCoverageService,
  trafficService,
  weatherService,
} from "../services/domainServices.js";
import { sendList, sendSuccess } from "../utils/httpResponse.js";

function createObservationController(service) {
  return {
    async list(req, res) {
      const result = await service.list(req.query);
      return sendList(res, result.items, result.meta);
    },

    async detail(req, res) {
      return sendSuccess(res, await service.getById(req.params.id));
    },

    async create(req, res) {
      return sendSuccess(res, await service.create(req.body), {}, 201);
    },

    async update(req, res) {
      return sendSuccess(res, await service.update(req.params.id, req.body));
    },

    async remove(req, res) {
      return sendSuccess(res, await service.remove(req.params.id));
    },

    async stats(req, res) {
      return sendSuccess(res, await service.stats(req.query));
    },
  };
}

export const adminWeatherController = createObservationController(weatherService);
export const adminTrafficController = createObservationController(trafficService);

export async function coverage(req, res) {
  return sendSuccess(res, await observationCoverageService.get(req.query));
}
