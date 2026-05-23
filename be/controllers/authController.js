import { sendSuccess } from "../utils/httpResponse.js";
import * as authService from "../services/authService.js";

export async function register(req, res) {
  const data = await authService.register(req.body);
  res.cookie("accessToken", data.accessToken, authService.getCookieOptions(false));
  return sendSuccess(res, data, {}, 201);
}

export async function login(req, res) {
  const data = await authService.login(req.body);
  res.cookie("accessToken", data.accessToken, authService.getCookieOptions(data.rememberMe));
  return sendSuccess(res, data);
}

export async function forgotPassword(req, res) {
  return sendSuccess(res, await authService.forgotPassword(req.body));
}

export async function resetPassword(req, res) {
  return sendSuccess(res, await authService.resetPassword(req.params.token, req.body));
}

export function logout(req, res) {
  res.clearCookie("accessToken", { path: "/" });
  return sendSuccess(res, { message: "Logged out successfully." });
}
