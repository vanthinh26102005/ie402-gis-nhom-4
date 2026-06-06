"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Car,
  Clock,
  CloudSun,
  Home,
  Info,
  MapPinned,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  RouteOff,
  X,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import type { MapLayerId } from "@/components/map/LayerTogglePanel";
import { requestDirectionsByDestinationIds } from "@/lib/api/routing";
import { useAuth } from "@/lib/auth/authContext";
import { useDestinations } from "@/lib/hooks/useDestinations";
import { useMapFeatures } from "@/lib/hooks/useMapFeatures";
import { useRouteDirections } from "@/lib/hooks/useRouteDirections";
import { formatDistance, formatDuration } from "@/lib/format/duration";
import { buildRouteAlternativeCandidates } from "@/lib/routing/alternatives";
import { estimateRouteTravelTime, type TravelMode } from "@/lib/routing/estimate";
import type { DestinationFeatureProperties } from "@/lib/types/destination";
import type { GeoJsonFeatureCollection } from "@/lib/types/geojson";
import type { RouteAlternative } from "@/lib/types/routing";
import { cn } from "@/lib/utils";

type RoutingExperienceProps = {
  initialEndId?: string;
  initialStartId?: string;
};

const TourismLeafletMap = dynamic(
  () => import("@/components/map/TourismLeafletMap").then((mod) => mod.TourismLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-screen place-items-center bg-brand-surface-container text-sm font-semibold text-slate-600">
        Đang tải bản đồ tuyến…
      </div>
    ),
  },
);

const travelModes: Array<{ label: string; value: TravelMode }> = [
  { label: "Ô tô", value: "car" },
  { label: "Xe máy", value: "motorbike" },
  { label: "Đi bộ + transit", value: "walk_transit" },
];

const routeLayerVisibility: Record<MapLayerId, boolean> = {
  destinations: true,
  services: false,
  weather: false,
  traffic: false,
  trafficHeatmap: false,
  weatherRiskHeatmap: false,
  route: true,
};

function getRouteComfortLabel(estimate: ReturnType<typeof estimateRouteTravelTime>) {
  if (!estimate) return "Chưa có tuyến";
  if (estimate.congestionFactor < 0.72 || estimate.weatherFactor < 0.78) return "Cần đi chậm";
  if (estimate.congestionFactor < 0.9 || estimate.weatherFactor < 0.9) return "Có lưu ý";
  return "Dễ đi";
}

function getRouteComfortDescription(estimate: ReturnType<typeof estimateRouteTravelTime>) {
  if (!estimate) return "Chọn điểm đi và điểm đến để xem gợi ý.";
  if (estimate.congestionFactor < 0.72) return "Có khả năng đông xe, nên chừa thêm thời gian.";
  if (estimate.weatherFactor < 0.78) return "Thời tiết có thể ảnh hưởng đến tốc độ di chuyển.";
  if (estimate.congestionFactor < 0.9 || estimate.weatherFactor < 0.9) return "Nên kiểm tra tình hình trước khi xuất phát.";
  return "Tuyến hiện tại phù hợp để di chuyển.";
}

export function RoutingExperience({
  initialEndId = "",
  initialStartId = "",
}: RoutingExperienceProps) {
  const { user } = useAuth();
  const { destinations, error: destinationsError, isLoading } = useDestinations();
  const mapData = useMapFeatures();
  const routing = useRouteDirections(initialStartId, initialEndId);
  const [travelMode, setTravelMode] = useState<TravelMode>("car");
  const [pace, setPace] = useState(2);
  const [isPlannerOpen, setIsPlannerOpen] = useState(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [routeAlternatives, setRouteAlternatives] = useState<RouteAlternative[]>([]);
  const [activeAlternativeId, setActiveAlternativeId] = useState<RouteAlternative["id"] | null>(null);
  const [isBuildingAlternatives, setIsBuildingAlternatives] = useState(false);

  useEffect(() => {
    if (routing.startId || destinations.length === 0) return;
    routing.setStartId(initialStartId || destinations[0]?.id || "");
    routing.setEndId(initialEndId || destinations[1]?.id || "");
  }, [destinations, initialEndId, initialStartId, routing]);

  const destinationOptions = useMemo(
    () => [
      { label: "Chọn địa điểm", value: "" },
      ...destinations.map((destination) => ({
        label: destination.name,
        value: destination.id,
      })),
    ],
    [destinations],
  );

  const startDestination = destinations.find((destination) => destination.id === routing.startId);
  const endDestination = destinations.find((destination) => destination.id === routing.endId);
  const routeEndpointIds = useMemo(
    () => new Set([routing.startId, routing.endId].filter(Boolean)),
    [routing.endId, routing.startId],
  );
  const selectedDestination =
    selectedDestinationId && routeEndpointIds.has(selectedDestinationId)
      ? destinations.find((destination) => destination.id === selectedDestinationId) || null
      : null;
  const error = destinationsError || routing.error || mapData.error;
  const activeAlternative = useMemo(
    () => routeAlternatives.find((alternative) => alternative.id === activeAlternativeId) || routeAlternatives[0] || null,
    [activeAlternativeId, routeAlternatives],
  );
  const activeRouteWaypointIds = useMemo(
    () => activeAlternative?.waypointIds ?? [],
    [activeAlternative],
  );
  const activeRouteDestinationIds = useMemo(
    () => new Set([routing.startId, ...activeRouteWaypointIds, routing.endId].filter(Boolean)),
    [activeRouteWaypointIds, routing.endId, routing.startId],
  );
  const inactiveRouteAlternatives = useMemo(
    () => routeAlternatives.filter((alternative) => alternative.id !== activeAlternativeId),
    [activeAlternativeId, routeAlternatives],
  );
  const routeAlternativeSummaries = useMemo(
    () =>
      routeAlternatives.map((alternative) => {
        const destinationIds = new Set([routing.startId, ...alternative.waypointIds, routing.endId].filter(Boolean));
        const alternativeTraffic = mapData.traffic.filter((item) =>
          item.destination_id ? destinationIds.has(item.destination_id) : true,
        );
        const alternativeWeather = mapData.weather.filter((item) =>
          item.destination_id ? destinationIds.has(item.destination_id) : true,
        );
        const waypointNames = alternative.waypointIds
          .map((waypointId) => destinations.find((destination) => destination.id === waypointId)?.name)
          .filter((name): name is string => Boolean(name));

        return {
          alternative,
          estimate: estimateRouteTravelTime({
            pace,
            route: alternative.route,
            traffic: alternativeTraffic,
            travelMode,
            weather: alternativeWeather,
          }),
          waypointNames,
        };
      }),
    [
      destinations,
      mapData.traffic,
      mapData.weather,
      pace,
      routeAlternatives,
      routing.endId,
      routing.startId,
      travelMode,
    ],
  );
  const routeTraffic = useMemo(
    () =>
      mapData.traffic.filter((item) =>
        item.destination_id ? activeRouteDestinationIds.has(item.destination_id) : true,
      ),
    [activeRouteDestinationIds, mapData.traffic],
  );
  const routeWeather = useMemo(
    () =>
      mapData.weather.filter((item) =>
        item.destination_id ? activeRouteDestinationIds.has(item.destination_id) : true,
      ),
    [activeRouteDestinationIds, mapData.weather],
  );
  const routeEstimate = useMemo(
    () =>
      estimateRouteTravelTime({
        pace,
        route: routing.route,
        traffic: routeTraffic,
        travelMode,
        weather: routeWeather,
      }),
    [pace, routeTraffic, routeWeather, routing.route, travelMode],
  );
  const routeDestinations = useMemo(() => {
    const features = mapData.destinations.features.filter((feature) => routeEndpointIds.has(feature.properties.id));

    return {
      ...mapData.destinations,
      features,
    } satisfies GeoJsonFeatureCollection<DestinationFeatureProperties>;
  }, [mapData.destinations, routeEndpointIds]);
  const isRouteDisabled =
    isLoading ||
    routing.isRouting ||
    isBuildingAlternatives ||
    !routing.startId ||
    !routing.endId ||
    routing.startId === routing.endId;

  async function handleRouteSearch() {
    setIsBuildingAlternatives(true);
    setRouteAlternatives([]);
    setActiveAlternativeId(null);
    const directRoute = await routing.calculateRoute();
    if (!directRoute) {
      setIsBuildingAlternatives(false);
      return;
    }

    const candidates = buildRouteAlternativeCandidates({
      destinations,
      endId: routing.endId,
      startId: routing.startId,
      traffic: mapData.traffic,
      weather: mapData.weather,
    });
    const alternativeResults = await Promise.allSettled(
      candidates.slice(1).map(async (candidate) => ({
        candidate,
        route: await requestDirectionsByDestinationIds([
          routing.startId,
          ...candidate.waypointIds,
          routing.endId,
        ]),
      })),
    );
    const nextAlternatives: RouteAlternative[] = [
      {
        description: candidates[0].description,
        id: "fastest",
        kind: "fastest",
        label: candidates[0].label,
        route: directRoute,
        waypointIds: [],
      },
      ...alternativeResults.flatMap((result) => {
        if (result.status === "rejected") return [];
        return [{
          description: result.value.candidate.description,
          id: result.value.candidate.id,
          kind: result.value.candidate.id,
          label: result.value.candidate.label,
          route: result.value.route,
          waypointIds: result.value.candidate.waypointIds,
        }];
      }),
    ];

    setRouteAlternatives(nextAlternatives);
    setActiveAlternativeId("fastest");
    setIsBuildingAlternatives(false);
    setIsSummaryOpen(true);
  }

  function handleClearRoute() {
    routing.clearRoute();
    setRouteAlternatives([]);
    setActiveAlternativeId(null);
  }

  function handleAlternativeSelect(alternativeId: RouteAlternative["id"]) {
    const selectedAlternative = routeAlternatives.find((alternative) => alternative.id === alternativeId);
    if (!selectedAlternative) return;
    setActiveAlternativeId(alternativeId);
    routing.setRoute(selectedAlternative.route);
    setIsSummaryOpen(true);
  }

  function handleDestinationSelect(destinationId: string) {
    setSelectedDestinationId(destinationId);
    setIsPlannerOpen(false);
    setIsSummaryOpen(false);
  }

  function persistRouteDraft() {
    if (!startDestination || !endDestination) return;
    window.localStorage.setItem(
      "gis-tour-route-draft",
      JSON.stringify({
        createdAt: new Date().toISOString(),
        description: routeEstimate
          ? `Tuyến ${startDestination.name} đến ${endDestination.name}. Quãng đường ${formatDistance(routeEstimate.distanceMeters)}, thời gian ước tính ${formatDuration(routeEstimate.totalDurationSeconds)}.`
          : `Tuyến ${startDestination.name} đến ${endDestination.name}.`,
        destinationIds: [startDestination.id, ...activeRouteWaypointIds, endDestination.id],
        distanceMeters: routeEstimate?.distanceMeters ?? routing.route?.distanceMeters ?? null,
        durationSeconds: routeEstimate?.totalDurationSeconds ?? routing.route?.durationSeconds ?? null,
        routeGeometry: routing.route?.geometry ?? null,
        title: `${startDestination.name} → ${endDestination.name}`,
        travelMode,
      }),
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-surface-container">
      <TourismLeafletMap
        className="absolute inset-0 z-0"
        destinations={routeDestinations}
        services={mapData.services}
        alternativeRoutes={inactiveRouteAlternatives}
        routeGeometry={routing.route?.geometry ?? null}
        routeEndpointIds={{ endId: routing.endId, startId: routing.startId }}
        selectedDestinationId={selectedDestinationId}
        showLayerPanel={false}
        variant="workspace"
        visibleLayers={routeLayerVisibility}
        onDestinationSelect={handleDestinationSelect}
        onRouteAlternativeSelect={handleAlternativeSelect}
      />

      <header className="fixed left-3 right-3 top-3 z-[1200] flex flex-col gap-3 rounded-lg border border-white/70 bg-white/85 px-4 py-3 shadow-brand-map backdrop-blur-xl lg:left-5 lg:right-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-3 font-semibold text-brand-secondary">
          <span className="grid size-9 place-items-center rounded-full bg-brand-primary text-white">
            <Route className="size-5" aria-hidden="true" />
          </span>
          <span>Lộ trình du lịch</span>
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-[#6a6a6a]" aria-label="Điều hướng route">
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/map">
            Bản đồ
          </Link>
          <Link className="rounded-full bg-white px-3 py-2 text-brand-secondary shadow-[var(--shadow-brand-map)]" href="/route">
            Định tuyến
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/destinations">
            Điểm đến
          </Link>
          {user?.role === "admin" ? (
            <Link className="rounded-full px-3 py-2 hover:bg-white" href="/admin">
              Quản trị
            </Link>
          ) : null}
        </nav>
        <div className="flex flex-wrap gap-2">
          <Button asChild type="button" size="sm" variant="outline" className="min-h-10 rounded-lg bg-white">
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              User space
            </Link>
          </Button>
          <Button type="button" size="sm" className="min-h-10 rounded-lg" disabled={isRouteDisabled} onClick={handleRouteSearch}>
            <Navigation className="size-4" aria-hidden="true" />
            {routing.isRouting || isBuildingAlternatives ? "Đang tính…" : "Tạo lộ trình"}
          </Button>
        </div>
      </header>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="fixed left-3 top-24 z-[1110] rounded-lg bg-white lg:left-5"
        onClick={() => setIsPlannerOpen((current) => !current)}
      >
        {isPlannerOpen ? <PanelLeftClose className="size-4" aria-hidden="true" /> : <PanelLeftOpen className="size-4" aria-hidden="true" />}
        Tùy chọn
      </Button>

      <aside className={cn(
        "fixed bottom-4 left-3 right-3 z-[1100] max-h-[48vh] overflow-auto rounded-lg border border-white/70 bg-white/90 shadow-brand-map backdrop-blur-xl transition-transform lg:bottom-auto lg:left-5 lg:right-auto lg:top-36 lg:max-h-[calc(100vh-9rem)] lg:w-[370px]",
        !isPlannerOpen && "-translate-x-[calc(100%+2rem)]",
      )}>
        <div className="border-b border-slate-200/80 p-5">
          <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-primary">
            Lên lịch trình
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">
            Tuyến du lịch miền Trung
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Chọn điểm đi, điểm đến rồi so sánh các phương án phù hợp với lịch trình của bạn.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase text-slate-500">Điểm bắt đầu</span>
            <Select
              value={routing.startId}
              onChange={(event) => routing.setStartId(event.target.value)}
              options={destinationOptions}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase text-slate-500">Điểm đến</span>
            <Select
              value={routing.endId}
              onChange={(event) => routing.setEndId(event.target.value)}
              options={destinationOptions}
            />
          </label>

          <section>
            <h2 className="text-xs font-extrabold uppercase text-slate-500">Phương tiện</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {travelModes.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setTravelMode(mode.value)}
                  className={cn(
                    "min-h-9 rounded-full border px-3 text-sm font-bold transition-colors",
                    travelMode === mode.value
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-brand-outline-variant bg-white text-[#6a6a6a] hover:border-brand-secondary hover:bg-brand-surface-low",
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </section>

          <label className="block">
            <span className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase text-slate-500">
              Nhịp tham quan
              <span className="text-brand-primary">
                {pace === 1 ? "Gọn" : pace === 2 ? "Cân bằng" : "Chậm rãi"}
              </span>
            </span>
            <input
              value={pace}
              onChange={(event) => setPace(Number(event.target.value))}
              className="w-full accent-brand-primary"
              min={1}
              max={3}
              type="range"
            />
          </label>

          {routing.startId && routing.endId && routing.startId === routing.endId ? (
            <p className="rounded-lg border border-brand-danger/25 bg-brand-surface-low px-3 py-2 text-sm text-brand-danger">
              Vui lòng chọn hai địa điểm khác nhau.
            </p>
          ) : null}

          {error ? (
            <p className="rounded-lg border border-brand-danger/25 bg-brand-surface-low px-3 py-2 text-sm text-brand-danger">
              {error}
            </p>
          ) : null}

          <Button type="button" className="w-full rounded-lg" disabled={isRouteDisabled} onClick={handleRouteSearch}>
            <Route className="size-4" aria-hidden="true" />
            {routing.isRouting || isBuildingAlternatives ? "Đang tìm tuyến…" : "Tạo lộ trình"}
          </Button>
        </div>
      </aside>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="fixed right-5 top-24 z-[1110] hidden rounded-lg bg-white xl:inline-flex"
        onClick={() => setIsSummaryOpen((current) => !current)}
      >
        {isSummaryOpen ? <PanelLeftClose className="size-4" aria-hidden="true" /> : <PanelLeftOpen className="size-4" aria-hidden="true" />}
        Hành trình
      </Button>

      <aside className={cn(
        "fixed right-5 top-36 z-[1100] hidden max-h-[calc(100vh-9rem)] w-[390px] overflow-auto rounded-lg border border-white/70 bg-white/90 shadow-brand-map backdrop-blur-xl transition-transform xl:block",
        !isSummaryOpen && "translate-x-[calc(100%+2rem)]",
      )}>
        <section className="border-b border-slate-200/80 p-5">
          <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-heritage">
            Hành trình của bạn
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-950">Tóm tắt hành trình</h2>
          <div className="mt-4 space-y-1">
            <SummaryLine label="Dự kiến mất" value={routeEstimate ? formatDuration(routeEstimate.totalDurationSeconds) : "Chưa có"} />
            <SummaryLine label="Quãng đường" value={routeEstimate ? formatDistance(routeEstimate.distanceMeters) : "Chưa có"} />
            <SummaryLine label="Phương tiện" value={travelModes.find((mode) => mode.value === travelMode)?.label || "Ô tô"} />
            <SummaryLine label="Tình trạng tuyến" value={getRouteComfortLabel(routeEstimate)} />
          </div>
          {routeEstimate ? (
            <p className="mt-3 rounded-lg bg-brand-surface-low px-3 py-2 text-sm leading-6 text-slate-600">
              {getRouteComfortDescription(routeEstimate)}
            </p>
          ) : null}
          {routeAlternativeSummaries.length > 0 ? (
            <section className="mt-4">
              <h3 className="text-sm font-extrabold text-slate-950">Chọn tuyến phù hợp</h3>
              <div className="mt-3 grid gap-2">
                {routeAlternativeSummaries.map(({ alternative, estimate, waypointNames }) => (
                  <RouteAlternativeCard
                    key={alternative.id}
                    alternative={alternative}
                    estimate={estimate}
                    isActive={alternative.id === activeAlternativeId}
                    waypointNames={waypointNames}
                    onSelect={handleAlternativeSelect}
                  />
                ))}
              </div>
            </section>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" className="rounded-lg bg-white" disabled={!routing.route && !error} onClick={handleClearRoute}>
              <RouteOff className="size-4" aria-hidden="true" />
              Xóa tuyến
            </Button>
            <Button asChild size="sm" className="rounded-lg" disabled={!startDestination || !endDestination}>
              <Link
                href={`/tours/create?fromRoute=1&startId=${routing.startId}&endId=${routing.endId}`}
                onClick={persistRouteDraft}
              >
                Lập kế hoạch
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="border-b border-slate-200/80 p-5">
          <h3 className="text-base font-extrabold text-slate-950">Điểm trong hành trình</h3>
          <div className="mt-4 grid gap-3">
            <ItineraryStep index="01" title={startDestination?.name || "Chọn điểm bắt đầu"} meta={startDestination?.province.name || "Điểm xuất phát"} />
            {activeRouteWaypointIds.map((waypointId, index) => {
              const waypoint = destinations.find((destination) => destination.id === waypointId);
              return (
                <ItineraryStep
                  key={waypointId}
                  index={String(index + 2).padStart(2, "0")}
                  title={waypoint?.name || "Điểm ghé"}
                  meta={waypoint?.province.name || "Điểm dừng đề xuất"}
                />
              );
            })}
            <ItineraryStep
              index={String(activeRouteWaypointIds.length + 2).padStart(2, "0")}
              title={endDestination?.name || "Chọn điểm đến"}
              meta={endDestination?.province.name || "Điểm kết thúc"}
            />
          </div>
        </section>

        <section className="p-5">
          <h3 className="text-base font-extrabold text-slate-950">Lưu ý trước khi đi</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <ContextRow icon={Car} text="Chọn tuyến phù hợp với mục tiêu: nhanh, dễ đi, hoặc nhiều điểm ghé." />
            <ContextRow icon={CloudSun} text="Nếu thời tiết không thuận lợi, nên chừa thêm thời gian nghỉ." />
            <ContextRow icon={Clock} text="Thời gian hiển thị đã tính thêm nhịp tham quan và thời gian dừng nghỉ." />
          </div>
        </section>
      </aside>

      {selectedDestination ? (
        <section
          role="dialog"
          aria-label={`Chi tiết ${selectedDestination.name}`}
          className="fixed inset-x-3 bottom-3 z-[1200] flex max-h-[72vh] flex-col overflow-hidden rounded-lg border border-white/70 bg-white/95 shadow-brand-map backdrop-blur-xl md:inset-x-auto md:bottom-5 md:right-5 md:top-28 md:w-[min(440px,calc(100vw-2rem))] md:max-h-none"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/80 p-5">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand-primary">Điểm đang chọn</p>
              <h2 className="mt-1 line-clamp-2 text-xl font-extrabold leading-tight text-slate-950">{selectedDestination.name}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">{selectedDestination.province.name}</p>
            </div>
            <button
              type="button"
              aria-label="Đóng chi tiết địa điểm"
              className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-brand-surface-low focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
              onClick={() => setSelectedDestinationId(null)}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <p className="text-sm leading-6 text-slate-600">
              {selectedDestination.description || "Điểm đang được dùng trong lộ trình."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
              <span className="rounded-lg bg-brand-surface-low px-3 py-2">
                {selectedDestination.id === routing.startId ? "Điểm bắt đầu A" : "Điểm kết thúc B"}
              </span>
              <span className="rounded-lg bg-brand-surface-low px-3 py-2">
                {selectedDestination.category?.name || "Điểm du lịch"}
              </span>
            </div>
          </div>
          <div className="shrink-0 border-t border-slate-200/80 bg-white/80 p-4">
            <Button asChild size="sm" variant="outline" className="min-h-11 w-full rounded-lg bg-white">
              <Link href={`/destinations/${selectedDestination.id}`}>
                <Info className="size-4" aria-hidden="true" />
                Xem trang chi tiết
              </Link>
            </Button>
          </div>
        </section>
      ) : null}

      <div className="fixed bottom-4 right-4 z-[1050] hidden rounded-lg border border-white/70 bg-white/90 p-3 text-xs font-bold text-slate-600 shadow-brand-map backdrop-blur-xl md:block">
        {routing.route ? "Tuyến đã sẵn sàng" : "Chưa có tuyến đang vẽ"}
      </div>
    </main>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <strong className="text-right font-mono text-sm text-slate-950">{value}</strong>
    </div>
  );
}

function RouteAlternativeCard({
  alternative,
  estimate,
  isActive,
  onSelect,
  waypointNames,
}: {
  alternative: RouteAlternative;
  estimate: ReturnType<typeof estimateRouteTravelTime>;
  isActive: boolean;
  onSelect: (alternativeId: RouteAlternative["id"]) => void;
  waypointNames: string[];
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={cn(
        "grid gap-2 rounded-lg border p-3 text-left transition-colors",
        isActive
          ? "border-brand-primary bg-brand-gis-soft text-brand-secondary"
          : "border-brand-outline-variant bg-white hover:border-brand-secondary hover:bg-brand-surface-low",
      )}
      onClick={() => onSelect(alternative.id)}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-sm font-extrabold text-slate-950">{alternative.label}</span>
          <span className="mt-1 block text-xs leading-5 text-slate-600">{alternative.description}</span>
        </span>
        {isActive ? (
          <span className="rounded-full bg-brand-primary px-2 py-1 text-[11px] font-extrabold text-white">
            Đang chọn
          </span>
        ) : null}
      </span>
      <span className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
        <span className="rounded-md bg-white/80 px-2 py-1.5">
          {estimate ? formatDuration(estimate.totalDurationSeconds) : "Chưa có ETA"}
        </span>
        <span className="rounded-md bg-white/80 px-2 py-1.5">
          {formatDistance(alternative.route.distanceMeters)}
        </span>
      </span>
      {waypointNames.length > 0 ? (
        <span className="text-xs font-semibold text-slate-500">
          Qua {waypointNames.join(", ")}
        </span>
      ) : null}
    </button>
  );
}

function ItineraryStep({ index, title, meta }: { index: string; title: string; meta: string }) {
  return (
    <article className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <span className="grid size-8 place-items-center rounded-full bg-brand-primary font-mono text-xs font-black text-white">
        {index}
      </span>
      <div className="min-w-0">
        <strong className="block truncate text-sm text-slate-950">{title}</strong>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
          <MapPinned className="size-3" aria-hidden="true" />
          {meta}
        </p>
      </div>
    </article>
  );
}

function ContextRow({ icon: Icon, text }: { icon: typeof Navigation; text: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-brand-primary" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
