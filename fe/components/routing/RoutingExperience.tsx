"use client";

import { useEffect, useState } from "react";
import { MapView } from "@/components/map/MapView";
import { RouteResultSummary } from "@/components/routing/RouteResultSummary";
import { RouteSearchPanel } from "@/components/routing/RouteSearchPanel";
import type { DestinationSummary, RouteResult } from "@/lib/gis";
import { fetchDestinations, requestDirections } from "@/lib/gis";

export function RoutingExperience() {
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [isRouting, setIsRouting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDestinations() {
      try {
        setIsLoadingDestinations(true);
        setError(null);
        const items = await fetchDestinations();
        if (isMounted) {
          setDestinations(items);
          setStartId(items[0]?.id ?? "");
          setEndId(items[1]?.id ?? "");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không thể tải danh sách địa điểm.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingDestinations(false);
        }
      }
    }

    loadDestinations();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleRouteSearch() {
    if (!startId || !endId || startId === endId) {
      return;
    }

    try {
      setIsRouting(true);
      setError(null);
      const routeResult = await requestDirections(startId, endId);
      setRoute(routeResult);
    } catch (routeError) {
      setRoute(null);
      setError(
        routeError instanceof Error
          ? routeError.message
          : "Không thể tìm đường với OSRM.",
      );
    } finally {
      setIsRouting(false);
    }
  }

  return (
    <div className="space-y-5">
      <RouteSearchPanel
        destinations={destinations}
        startId={startId}
        endId={endId}
        isLoading={isLoadingDestinations || isRouting}
        onStartChange={setStartId}
        onEndChange={setEndId}
        onSubmit={handleRouteSearch}
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isRouting ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Đang gọi OSRM và tính tuyến đường...
        </div>
      ) : null}

      {route ? <RouteResultSummary route={route} /> : null}

      <MapView routeGeometry={route?.geometry ?? null} />
    </div>
  );
}
