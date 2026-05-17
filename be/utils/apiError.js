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
