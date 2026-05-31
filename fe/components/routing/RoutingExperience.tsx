"use client";

import { useEffect } from "react";
import { MapView } from "@/components/map/MapView";
import { RouteResultSummary } from "@/components/routing/RouteResultSummary";
import { RouteSearchPanel } from "@/components/routing/RouteSearchPanel";
import { useDestinations } from "@/lib/hooks/useDestinations";
import { useRouteDirections } from "@/lib/hooks/useRouteDirections";

type RoutingExperienceProps = {
  initialEndId?: string;
  initialStartId?: string;
};

export function RoutingExperience({
  initialEndId = "",
  initialStartId = "",
}: RoutingExperienceProps) {
  const { destinations, error: destinationsError, isLoading } = useDestinations();
  const routing = useRouteDirections(initialStartId, initialEndId);

  useEffect(() => {
    if (routing.startId || destinations.length === 0) {
      return;
    }

    routing.setStartId(initialStartId || destinations[0]?.id || "");
    routing.setEndId(initialEndId || destinations[1]?.id || "");
  }, [destinations, initialEndId, initialStartId, routing]);

  async function handleRouteSearch() {
    await routing.calculateRoute();
  }

  const error = destinationsError || routing.error;

  return (
    <div className="space-y-5">
      <RouteSearchPanel
        destinations={destinations}
        startId={routing.startId}
        endId={routing.endId}
        isLoading={isLoading || routing.isRouting}
        onStartChange={routing.setStartId}
        onEndChange={routing.setEndId}
        onSubmit={handleRouteSearch}
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {routing.isRouting ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Đang gọi OSRM và tính tuyến đường...
        </div>
      ) : null}

      {routing.route ? <RouteResultSummary route={routing.route} /> : null}

      <MapView routeGeometry={routing.route?.geometry ?? null} />
    </div>
  );
}
