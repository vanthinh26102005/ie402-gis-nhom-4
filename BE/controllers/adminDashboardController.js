import {
  adminDashboardService,
  observationCoverageService,
  trafficService,
  weatherService,
} from "../services/domainServices.js";
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

export async function weatherStats(req, res) {
  return sendSuccess(res, await weatherService.stats(req.query));
}

export async function trafficStats(req, res) {
  return sendSuccess(res, await trafficService.stats(req.query));
}

export async function dataCoverage(req, res) {
  return sendSuccess(res, await observationCoverageService.get(req.query));
}
