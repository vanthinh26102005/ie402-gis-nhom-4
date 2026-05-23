import { sendSuccess } from "../utils/httpResponse.js";
import * as authService from "../services/authService.js";

export function register(req, res) {
  return sendSuccess(res, authService.register(req.body), {}, 201);
}

export function login(req, res) {
  return sendSuccess(res, authService.login(req.body));
}
