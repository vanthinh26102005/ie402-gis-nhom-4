import { sendSuccess } from "../utils/httpResponse.js";
import { getCurrentUser } from "../services/authService.js";

export function me(req, res) {
  return sendSuccess(res, getCurrentUser());
}
