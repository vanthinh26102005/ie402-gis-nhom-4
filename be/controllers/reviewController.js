import { sendList, sendSuccess } from "../utils/httpResponse.js";
import { reviewService } from "../services/domainServices.js";

export async function list(req, res) {
  return sendList(res, await reviewService.list(req.query));
}

export async function create(req, res) {
  return sendSuccess(res, await reviewService.create(req.body), {}, 201);
}

export async function detail(req, res) {
  return sendSuccess(res, await reviewService.getById(req.params.id));
}

export async function moderate(req, res) {
  return sendSuccess(res, await reviewService.moderate(req.params.id, req.body));
}
