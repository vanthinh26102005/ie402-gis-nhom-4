const AUTH_TOKEN_KEY = "auth_token";
const AUTH_TOKEN_EXPIRY_KEY = "auth_token_expiry";

/**
 * Set authentication token in localStorage or sessionStorage
 * @param token The JWT token
 * @param rememberMe If true, use localStorage; otherwise use sessionStorage
 */
export function setAuthToken(token: string, rememberMe = false): void {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_TOKEN_KEY, token);

  // Optional: store expiry time if you want to handle token expiry
  // For now, we're relying on the server to validate token expiry via Set-Cookie
}

/**
 * Get authentication token from storage
 * Checks localStorage first, then sessionStorage
 */
export function getAuthToken(): string | null {
  // Check localStorage first (for "remember me" users)
  let token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) return token;

  // Then check sessionStorage
  token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  return token;
}

/**
 * Clear authentication token from both storages
 */
export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
}

/**
 * Check if user has a valid auth token
 */
export function hasAuthToken(): boolean {
  return !!getAuthToken();
}

/**
 * Store user info in localStorage (for persistence across page refreshes)
 */
export function setUserInfo(userInfo: unknown): void {
  localStorage.setItem("user_info", JSON.stringify(userInfo));
}

/**
 * Get stored user info from localStorage
 */
export function getUserInfo<T = unknown>(): T | null {
  const stored = localStorage.getItem("user_info");
  return stored ? (JSON.parse(stored) as T) : null;
}

/**
 * Clear stored user info
 */
export function clearUserInfo(): void {
  localStorage.removeItem("user_info");
}
