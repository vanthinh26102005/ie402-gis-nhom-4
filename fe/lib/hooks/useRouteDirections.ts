"use client";

import { useCallback, useState } from "react";
import { requestDirections } from "@/lib/api/routing";
import type { RouteResult } from "@/lib/types/routing";

export function useRouteDirections(initialStartId = "", initialEndId = "") {
  const [startId, setStartId] = useState(initialStartId);
  const [endId, setEndId] = useState(initialEndId);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = useCallback(
    async (nextStartId = startId, nextEndId = endId) => {
      if (!nextStartId || !nextEndId) {
        setError("Vui lòng chọn đầy đủ điểm bắt đầu và điểm đến.");
        return null;
      }

      if (nextStartId === nextEndId) {
        setError("Điểm bắt đầu và điểm đến không được trùng nhau.");
        return null;
      }

      try {
        setIsRouting(true);
        setError(null);
        const routeResult = await requestDirections(nextStartId, nextEndId);
        setRoute(routeResult);
        return routeResult;
      } catch (routeError) {
        setRoute(null);
        setError(routeError instanceof Error ? routeError.message : "Không thể tìm đường với OSRM.");
        return null;
      } finally {
        setIsRouting(false);
      }
    },
    [endId, startId],
  );

  const clearRoute = useCallback(() => {
    setRoute(null);
    setError(null);
  }, []);

  return {
    calculateRoute,
    clearRoute,
    endId,
    error,
    isRouting,
    route,
    setEndId,
    setError,
    setRoute,
    setStartId,
    startId,
  };
}
