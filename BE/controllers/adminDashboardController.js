import { adminDashboardService } from "../services/domainServices.js";
import { sendSuccess } from "../utils/httpResponse.js";

export async function stats(req, res) {
  return sendSuccess(res, await adminDashboardService.stats());
}

export async function routeDemand(req, res) {
  return sendSuccess(res, await adminDashboardService.routeDemand());
}

export async function destinationMix(req, res) {
  return sendSuccess(res, await adminDashboardService.destinationMix());
}
