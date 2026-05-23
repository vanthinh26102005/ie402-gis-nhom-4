import { sendError } from "../utils/httpResponse.js";
import { notFound } from "../utils/apiError.js";

export function notFoundHandler(req, res, next) {
  next(notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err, req, res, next) {
  return sendError(res, err);
}
