import { getDirections } from "../services/routingService.js";
import { sendSuccess } from "../utils/httpResponse.js";

export async function directions(req, res) {
  const route = await getDirections(req.body);
  return sendSuccess(res, route);
}
