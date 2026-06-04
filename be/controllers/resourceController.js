import { sendList, sendSuccess } from "../utils/httpResponse.js";

export function createResourceController(resourceService) {
  return {
    async list(req, res) {
      const items = await resourceService.list(req.query);
      return sendList(res, items);
    },

    async detail(req, res) {
      const item = await resourceService.getById(req.params.id);
      return sendSuccess(res, item);
    },

    async create(req, res) {
      const item = await resourceService.create(req.body);
      return sendSuccess(res, item, {}, 201);
    },

    async update(req, res) {
      const item = await resourceService.update(req.params.id, req.body);
      return sendSuccess(res, item);
    },

    async remove(req, res) {
      const item = await resourceService.remove(req.params.id);
      return sendSuccess(res, item);
    },
  };
}
