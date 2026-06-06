import { fetchApi } from "@/lib/api/client";
import type { RouteResult } from "@/lib/types/routing";

export async function requestDirectionsByDestinationIds(destinationIds: string[]) {
  return fetchApi<RouteResult>("/routing/directions", {
    method: "POST",
    body: JSON.stringify({
      profile: "driving",
      waypoints: destinationIds.map((id) => ({ type: "destination", id })),
    }),
  });
}

export async function requestDirections(startId: string, endId: string) {
  return requestDirectionsByDestinationIds([startId, endId]);
}

export async function getRoute(startId: string, endId: string) {
  return requestDirections(startId, endId);
}
