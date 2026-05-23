import { badRequest } from "../utils/apiError.js";

export function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const field of schema) {
      const value = req.body?.[field.name];

      if (field.required && (value === undefined || value === null || value === "")) {
        errors.push(`${field.name} is required`);
        continue;
      }

      if (value === undefined || value === null || value === "") {
        continue;
      }

      if (field.type && typeof value !== field.type) {
        errors.push(`${field.name} must be a ${field.type}`);
      }

      if (field.minLength && String(value).length < field.minLength) {
        errors.push(`${field.name} must be at least ${field.minLength} characters`);
      }

      if (field.maxLength && String(value).length > field.maxLength) {
        errors.push(`${field.name} must be at most ${field.maxLength} characters`);
      }

      if (field.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        errors.push(`${field.name} must be a valid email`);
      }

      if (field.equals && value !== req.body?.[field.equals]) {
        errors.push(`${field.name} must match ${field.equals}`);
      }
    }

    if (errors.length > 0) {
      return next(badRequest(errors.join(", ")));
    }

    return next();
  };
}

