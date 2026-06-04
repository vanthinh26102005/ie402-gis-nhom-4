import {
  listLatestTraffic,
  listLatestWeather,
  listTrafficAlerts,
} from "../repositories/weatherTrafficRepository.js";

export function getAllWeather() {
  return listLatestWeather();
}

export function getAllTraffic() {
  return listLatestTraffic();
}

export function getTrafficAlerts() {
  return listTrafficAlerts();
}
