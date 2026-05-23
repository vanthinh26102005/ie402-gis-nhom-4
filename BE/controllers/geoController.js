import {
  listDestinationFeatures,
  listProvinceFeatures,
  listServiceFeatures,
} from "../services/geoService.js";
import { sendSuccess } from "../utils/httpResponse.js";

export async function destinationFeatures(req, res) {
  const geojson = await listDestinationFeatures(req.query);
  return sendSuccess(res, geojson);
}

export async function serviceFeatures(req, res) {
  const geojson = await listServiceFeatures(req.query);
  return sendSuccess(res, geojson);
}

export async function provinceFeatures(req, res) {
  const geojson = await listProvinceFeatures();
  return sendSuccess(res, geojson);
}
