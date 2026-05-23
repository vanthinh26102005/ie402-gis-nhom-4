import { sendList, sendSuccess } from "../utils/httpResponse.js";

export function createResourceController(resourceService) {
  return {
    list(req, res) {
      const items = resourceService.list(req.query);
      return sendList(res, items);
    },

    detail(req, res) {
      const item = resourceService.getById(req.params.id);
      return sendSuccess(res, item);
    },

    create(req, res) {
      const item = resourceService.create(req.body);
      return sendSuccess(res, item, {}, 201);
    },

    update(req, res) {
      const item = resourceService.update(req.params.id, req.body);
      return sendSuccess(res, item);
    },

    remove(req, res) {
      const item = resourceService.remove(req.params.id);
      return sendSuccess(res, item);
    },
  };
}
