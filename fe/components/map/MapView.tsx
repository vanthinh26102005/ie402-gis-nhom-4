"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Route, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { formatDistance, formatDuration } from "@/lib/format/duration";
import { useMapFeatures } from "@/lib/hooks/useMapFeatures";
import { useRouteDirections } from "@/lib/hooks/useRouteDirections";
import type { DestinationFeatureProperties } from "@/lib/types/destination";
import type { GeoJsonFeatureCollection, GeoJsonLineString } from "@/lib/types/geojson";
import type { RouteResult } from "@/lib/types/routing";

const TourismLeafletMap = dynamic(
  () => import("@/components/map/TourismLeafletMap").then((mod) => mod.TourismLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600">
        Đang tải bản đồ...
      </div>
    ),
  },
);

type MapViewProps = {
  enableRoutingControls?: boolean;
  routeGeometry?: GeoJsonLineString | null;
};

export function MapView({ enableRoutingControls = false, routeGeometry }: MapViewProps) {
  const { destinations, error, isLoading, services } = useMapFeatures();
  const routing = useRouteDirections();

  useEffect(() => {
    if (!enableRoutingControls || routing.startId || destinations.features.length === 0) {
      return;
    }

    routing.setStartId(destinations.features[0]?.properties.id ?? "");
    routing.setEndId(destinations.features[1]?.properties.id ?? "");
  }, [destinations.features, enableRoutingControls, routing]);

  const activeRouteGeometry = routeGeometry ?? routing.route?.geometry ?? null;

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600">
        Đang tải dữ liệu GIS...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enableRoutingControls ? (
        <MapRoutingPanel
          destinations={destinations}
          endId={routing.endId}
          error={routing.error}
          isRouting={routing.isRouting}
          route={routing.route}
          startId={routing.startId}
          onClearRoute={routing.clearRoute}
          onEndChange={routing.setEndId}
          onRouteSearch={() => routing.calculateRoute()}
          onStartChange={routing.setStartId}
        />
      ) : null}

      <TourismLeafletMap destinations={destinations} services={services} routeGeometry={activeRouteGeometry} />
    </div>
  );
}

type MapRoutingPanelProps = {
  destinations: GeoJsonFeatureCollection<DestinationFeatureProperties>;
  endId: string;
  error: string | null;
  isRouting: boolean;
  route: RouteResult | null;
  startId: string;
  onClearRoute: () => void;
  onEndChange: (value: string) => void;
  onRouteSearch: () => void;
  onStartChange: (value: string) => void;
};

function MapRoutingPanel({
  destinations,
  endId,
  error,
  isRouting,
  route,
  startId,
  onClearRoute,
  onEndChange,
  onRouteSearch,
  onStartChange,
}: MapRoutingPanelProps) {
  const destinationOptions = destinations.features.map((feature) => ({
    label: feature.properties.name,
    value: feature.properties.id,
  }));
  const isRouteDisabled = isRouting || !startId || !endId || startId === endId;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="grid flex-1 gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Điểm bắt đầu</span>
            <Select value={startId} onChange={(event) => onStartChange(event.target.value)}>
              {destinationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Điểm đến</span>
            <Select value={endId} onChange={(event) => onEndChange(event.target.value)}>
              {destinationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={isRouteDisabled} onClick={onRouteSearch}>
            <Route className="h-4 w-4" aria-hidden="true" />
            {isRouting ? "Đang tính..." : "Vẽ tuyến"}
          </Button>
          <Button type="button" variant="secondary" disabled={!route && !error} onClick={onClearRoute}>
            <X className="h-4 w-4" aria-hidden="true" />
            Xóa
          </Button>
        </div>
      </div>

      {startId && endId && startId === endId ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Vui lòng chọn hai địa điểm khác nhau để vẽ tuyến.
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {route ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RouteStat label="Quãng đường" value={formatDistance(route.distanceMeters)} />
          <RouteStat label="Thời gian" value={formatDuration(route.durationSeconds)} />
          <RouteStat label="Nguồn định tuyến" value={route.source.toUpperCase()} />
        </div>
      ) : null}
    </section>
  );
}

function RouteStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
