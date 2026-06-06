import { tourService } from "../services/domainServices.js";
import { sendList, sendSuccess } from "../utils/httpResponse.js";

export async function list(req, res) {
  return sendList(res, await tourService.list(req.user.id, req.query));
}

export async function detail(req, res) {
  return sendSuccess(res, await tourService.getById(req.params.id, req.user.id));
}

export async function create(req, res) {
  return sendSuccess(res, await tourService.create(req.user.id, req.body), {}, 201);
}

export async function update(req, res) {
  return sendSuccess(res, await tourService.update(req.params.id, req.user.id, req.body));
}

export async function remove(req, res) {
  return sendSuccess(res, await tourService.remove(req.params.id, req.user.id));
}
