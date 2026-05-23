import { sendList, sendSuccess } from "../utils/httpResponse.js";
import { reviewService } from "../services/domainServices.js";

export function list(req, res) {
  return sendList(res, reviewService.list(req.query));
}

export function create(req, res) {
  return sendSuccess(res, reviewService.create(req.body), {}, 201);
}

export function detail(req, res) {
  return sendSuccess(res, reviewService.getById(req.params.id));
}

export function moderate(req, res) {
  return sendSuccess(res, reviewService.moderate(req.params.id, req.body));
}
