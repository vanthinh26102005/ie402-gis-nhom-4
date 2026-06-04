import {
  getAllTraffic,
  getAllWeather,
  getTrafficAlerts,
} from "../services/weatherTrafficService.js";
import { sendList } from "../utils/httpResponse.js";

export async function listWeather(req, res) {
  const weather = await getAllWeather();
  return sendList(res, weather);
}

export async function listTraffic(req, res) {
  const traffic = await getAllTraffic();
  return sendList(res, traffic);
}

export async function listAlerts(req, res) {
  const alerts = await getTrafficAlerts();
  return sendList(res, alerts);
}
