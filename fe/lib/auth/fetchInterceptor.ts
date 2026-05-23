import { getAuthToken } from "./tokenStorage";

/**
 * Wrapper around fetch that automatically adds authorization headers
 */
export async function fetchWithAuth(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const token = getAuthToken();

  const headers = {
    ...options?.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - token might be expired
  if (response.status === 401) {
    // Clear token and redirect to login if needed
    const { clearAuthToken } = await import("./tokenStorage");
    clearAuthToken();

    // You might want to emit an event or call a callback here
    // to trigger a redirect to login page
  }

  return response;
}

/**
 * Intercept global fetch to add auth headers (alternative approach)
 * Call this in your layout or main app initialization
 */
export function setupFetchInterceptor(): void {
  const originalFetch = window.fetch;

  window.fetch = function (
    ...args: Parameters<typeof fetch>
  ): ReturnType<typeof fetch> {
    const [resource, config] = args;
    const token = getAuthToken();

    if (token) {
      const headers = new Headers(config?.headers || {});
      headers.set("Authorization", `Bearer ${token}`);

      return originalFetch(resource, {
        ...config,
        headers,
      });
    }

    return originalFetch(resource, config);
  };
}
