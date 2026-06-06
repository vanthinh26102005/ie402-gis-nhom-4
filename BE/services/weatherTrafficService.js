import {
  listLatestTraffic,
  listLatestWeather,
  listTrafficObservations,
  listWeatherObservations,
  listTrafficAlerts,
} from "../repositories/weatherTrafficRepository.js";
import { badRequest } from "../utils/apiError.js";

function normalizeTemporalMode(mode) {
  if (!mode) return "latest";
  if (["latest", "all", "at"].includes(mode)) return mode;
  throw badRequest("mode must be latest, all, or at");
}

export function getAllWeather(query = {}) {
  const mode = normalizeTemporalMode(query.mode);
  if (mode === "all") return listWeatherObservations(query);
  if (mode === "at" && !query.at) throw badRequest("at is required when mode is at");
  if (mode === "at") return listLatestWeather({ at: query.at });
  return listLatestWeather();
}

export function getAllTraffic(query = {}) {
  const mode = normalizeTemporalMode(query.mode);
  if (mode === "all") return listTrafficObservations(query);
  if (mode === "at" && !query.at) throw badRequest("at is required when mode is at");
  if (mode === "at") return listLatestTraffic({ at: query.at });
  return listLatestTraffic();
}

export function getTrafficAlerts() {
  return listTrafficAlerts();
}
