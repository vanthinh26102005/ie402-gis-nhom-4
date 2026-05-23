import {
  getDestinationGeoJson,
  getProvinceGeoJson,
  getServiceGeoJson,
} from "../repositories/geoRepository.js";

export function listDestinationFeatures(query) {
  return getDestinationGeoJson(query);
}

export function listServiceFeatures(query) {
  return getServiceGeoJson(query);
}

export function listProvinceFeatures() {
  return getProvinceGeoJson();
}
