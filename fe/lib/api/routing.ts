import { fetchApi } from "@/lib/api/client";
import type { RouteResult } from "@/lib/types/routing";

export async function requestDirections(startId: string, endId: string) {
  return fetchApi<RouteResult>("/routing/directions", {
    method: "POST",
    body: JSON.stringify({
      profile: "driving",
      waypoints: [
        { type: "destination", id: startId },
        { type: "destination", id: endId },
      ],
    }),
  });
}

export async function getRoute(startId: string, endId: string) {
  return requestDirections(startId, endId);
}
