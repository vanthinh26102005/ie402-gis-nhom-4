import { sendSuccess } from "../utils/httpResponse.js";

export function me(req, res) {
  return sendSuccess(res, req.user);
}
