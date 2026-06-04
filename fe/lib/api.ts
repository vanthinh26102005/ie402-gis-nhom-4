export { API_BASE_URL, fetchApi } from "@/lib/api/client";
export type { ApiEnvelope, ApiResult } from "@/lib/api/envelope";

export {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "@/lib/api/auth";
export type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/lib/api/auth";

export {
  fetchDestinationDetail,
  fetchDestinations,
  getDestinationById,
  getDestinations,
} from "@/lib/api/destinations";
export { fetchDestinationFeatures, fetchServiceFeatures } from "@/lib/api/geo";
export { getRoute, requestDirections } from "@/lib/api/routing";
export {
  addReview,
  getReviewsWithLocal,
  submitReview,
} from "@/lib/api/reviews";
export type {
  SubmittedReview,
  SubmitReviewPayload,
} from "@/lib/api/reviews";
export { createTour } from "@/lib/api/tours";
export type { CreatedTour, CreateTourPayload } from "@/lib/types/tour";
export {
  getAllTraffic,
  getAllWeather,
  getTrafficAlerts,
} from "@/lib/api/weather-traffic";
export type {
  TrafficAlert,
  TrafficInfo,
  WeatherInfo,
} from "@/lib/types/weather-traffic";
