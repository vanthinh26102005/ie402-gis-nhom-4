import { sendSuccess } from "../utils/httpResponse.js";

export function health(req, res) {
  return sendSuccess(res, {
    status: "ok",
    service: "gis-tourism-api",
    timestamp: new Date().toISOString(),
  });
}
