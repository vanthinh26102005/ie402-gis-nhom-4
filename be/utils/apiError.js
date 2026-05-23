export class ApiError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function notFound(message = "Resource not found") {
  return new ApiError(404, message, "NOT_FOUND");
}

export function badRequest(message = "Invalid request") {
  return new ApiError(400, message, "BAD_REQUEST");
}

export function unauthorized(message = "Authentication required") {
  return new ApiError(401, message, "UNAUTHORIZED");
}

export function forbidden(message = "Forbidden") {
  return new ApiError(403, message, "FORBIDDEN");
}

export function conflict(message = "Resource already exists") {
  return new ApiError(409, message, "CONFLICT");
}
