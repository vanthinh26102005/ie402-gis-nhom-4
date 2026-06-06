import { sendList, sendSuccess } from "../utils/httpResponse.js";
import { reviewService } from "../services/domainServices.js";

export async function list(req, res) {
  const publicOnly = !req.originalUrl.startsWith("/api/admin");
  return sendList(res, await reviewService.list(req.query, { publicOnly }));
}

export async function summary(req, res) {
  return sendSuccess(res, await reviewService.summary(req.query.destinationId || req.query.destination_id));
}

export async function create(req, res) {
  return sendSuccess(res, await reviewService.create(req.user?.id, req.body), {}, 201);
}

export async function detail(req, res) {
  return sendSuccess(res, await reviewService.getById(req.params.id));
}

export async function moderate(req, res) {
  return sendSuccess(res, await reviewService.moderate(req.params.id, req.body));
}
