"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Car,
  Clock,
  CloudSun,
  MapPinned,
  Navigation,
  Route,
  RouteOff,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import type { MapLayerId } from "@/components/map/LayerTogglePanel";
import { useDestinations } from "@/lib/hooks/useDestinations";
import { useMapFeatures } from "@/lib/hooks/useMapFeatures";
import { useRouteDirections } from "@/lib/hooks/useRouteDirections";
import { formatDistance, formatDuration } from "@/lib/format/duration";
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
        Đang tải bản đồ tuyến...
      </div>
    ),
  },
);

const travelModes = ["Ô tô", "Xe máy", "Đi bộ + transit"];

const routeLayerVisibility: Record<MapLayerId, boolean> = {
  destinations: true,
  services: true,
  route: true,
};

export function RoutingExperience({
  initialEndId = "",
  initialStartId = "",
}: RoutingExperienceProps) {
  const { destinations, error: destinationsError, isLoading } = useDestinations();
  const mapData = useMapFeatures();
  const routing = useRouteDirections(initialStartId, initialEndId);
  const [travelMode, setTravelMode] = useState(travelModes[0]);
  const [pace, setPace] = useState(2);

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
  const error = destinationsError || routing.error || mapData.error;
  const isRouteDisabled =
    isLoading ||
    routing.isRouting ||
    !routing.startId ||
    !routing.endId ||
    routing.startId === routing.endId;

  async function handleRouteSearch() {
    await routing.calculateRoute();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-surface-container">
      <TourismLeafletMap
        className="absolute inset-0 z-0"
        destinations={mapData.destinations}
        services={mapData.services}
        routeGeometry={routing.route?.geometry ?? null}
        showLayerPanel={false}
        variant="workspace"
        visibleLayers={routeLayerVisibility}
      />

      <header className="fixed left-3 right-3 top-3 z-[1200] flex flex-col gap-3 rounded-lg border border-white/70 bg-white/85 px-4 py-3 shadow-brand-map backdrop-blur-xl lg:left-5 lg:right-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-3 font-extrabold text-slate-950">
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-gis text-white">
            <Route className="size-5" aria-hidden="true" />
          </span>
          <span>Route Planner GIS</span>
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm font-bold text-slate-600" aria-label="Điều hướng route">
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/map">
            Bản đồ
          </Link>
          <Link className="rounded-full bg-white px-3 py-2 text-brand-primary shadow-sm" href="/route">
            Định tuyến
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/destinations">
            Điểm đến
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/admin">
            Quản trị
          </Link>
        </nav>
        <Button type="button" size="sm" className="min-h-10 rounded-lg" disabled={isRouteDisabled} onClick={handleRouteSearch}>
          <Navigation className="size-4" aria-hidden="true" />
          {routing.isRouting ? "Đang tính..." : "Tạo lộ trình"}
        </Button>
      </header>

      <aside className="fixed bottom-4 left-3 right-3 z-[1100] max-h-[48vh] overflow-auto rounded-lg border border-white/70 bg-white/90 shadow-brand-map backdrop-blur-xl lg:bottom-auto lg:left-5 lg:right-auto lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-[370px]">
        <div className="border-b border-slate-200/80 p-5">
          <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-primary">
            Smart planner
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">
            Tuyến du lịch miền Trung
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Chọn điểm đi, điểm đến và vẽ tuyến OSRM trực tiếp trên bản đồ nền.
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
                  key={mode}
                  type="button"
                  onClick={() => setTravelMode(mode)}
                  className={cn(
                    "min-h-9 rounded-full border px-3 text-sm font-bold transition-colors",
                    travelMode === mode
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-primary hover:bg-blue-50",
                  )}
                >
                  {mode}
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
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Vui lòng chọn hai địa điểm khác nhau.
            </p>
          ) : null}

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button type="button" className="w-full rounded-lg" disabled={isRouteDisabled} onClick={handleRouteSearch}>
            <Route className="size-4" aria-hidden="true" />
            {routing.isRouting ? "Đang tính tuyến..." : "Tạo lộ trình"}
          </Button>
        </div>
      </aside>

      <aside className="fixed right-5 top-24 z-[1100] hidden max-h-[calc(100vh-7rem)] w-[390px] overflow-auto rounded-lg border border-white/70 bg-white/90 shadow-brand-map backdrop-blur-xl xl:block">
        <section className="border-b border-slate-200/80 p-5">
          <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-heritage">
            Route summary
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-950">Tóm tắt hành trình</h2>
          <div className="mt-4 space-y-1">
            <SummaryLine label="Quãng đường" value={routing.route ? formatDistance(routing.route.distanceMeters) : "Chưa có"} />
            <SummaryLine label="Thời gian" value={routing.route ? formatDuration(routing.route.durationSeconds) : "Chưa có"} />
            <SummaryLine label="Phương tiện" value={travelMode} />
            <SummaryLine label="Rủi ro thời tiết" value={pace === 3 ? "Thấp" : "Trung bình"} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" className="rounded-lg bg-white" disabled={!routing.route && !error} onClick={routing.clearRoute}>
              <RouteOff className="size-4" aria-hidden="true" />
              Xóa tuyến
            </Button>
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/tours/create">
                Lưu tour
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="border-b border-slate-200/80 p-5">
          <h3 className="text-base font-extrabold text-slate-950">Itinerary</h3>
          <div className="mt-4 grid gap-3">
            <ItineraryStep index="01" title={startDestination?.name || "Chọn điểm bắt đầu"} meta={startDestination?.province.name || "Điểm xuất phát"} />
            <ItineraryStep index="02" title={endDestination?.name || "Chọn điểm đến"} meta={endDestination?.province.name || "Điểm kết thúc"} />
          </div>
        </section>

        <section className="p-5">
          <h3 className="text-base font-extrabold text-slate-950">Ngữ cảnh vận hành</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <ContextRow icon={Car} text="OSRM đang là nguồn định tuyến chính." />
            <ContextRow icon={CloudSun} text="Kiểm tra thời tiết trước các tuyến đèo và rừng." />
            <ContextRow icon={Clock} text="Nhịp chậm rãi cộng thêm thời gian dừng nghỉ." />
          </div>
        </section>
      </aside>

      <div className="fixed bottom-4 right-4 z-[1050] hidden rounded-lg border border-white/70 bg-white/90 p-3 text-xs font-bold text-slate-600 shadow-brand-map backdrop-blur-xl md:block">
        {routing.route ? "Tuyến OSRM đã sẵn sàng" : "Chưa có tuyến đang vẽ"}
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
