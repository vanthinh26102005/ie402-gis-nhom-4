"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  GripVertical,
  Home,
  Layers,
  LocateFixed,
  MapPinned,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Share2,
  Star,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { DestinationDetailDialog } from "@/components/map/DestinationDetailDialog";
import type { MapLayerId } from "@/components/map/LayerTogglePanel";
import { MapLegend } from "@/components/map/MapLegend";
import {
  TemporalControlPanel,
  type TemporalSignal,
  type TemporalTravelAdvice,
} from "@/components/map/TemporalControlPanel";
import { TemporalTimelineDialog } from "@/components/map/TemporalTimelineDialog";
import { useAuth } from "@/lib/auth/authContext";
import { useMapFeatures } from "@/lib/hooks/useMapFeatures";
import {
  buildTemporalTicks,
  buildSteppedTemporalTicks,
  filterObservationsByDestination,
  pickNewestObservation,
  isRiskyTraffic,
  isRiskyWeather,
  pickTemporalObservations,
  type TemporalMode,
  type TemporalStepMinutes,
} from "@/lib/map/temporal";
import type { DestinationFeatureProperties } from "@/lib/types/destination";
import type { GeoJsonFeatureCollection } from "@/lib/types/geojson";
import type { ServiceFeatureProperties } from "@/lib/types/service";
import type { TrafficInfo, WeatherInfo } from "@/lib/types/weather-traffic";
import { cn } from "@/lib/utils";

const TourismLeafletMap = dynamic(
  () => import("@/components/map/TourismLeafletMap").then((mod) => mod.TourismLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-screen place-items-center bg-brand-surface-container text-sm font-semibold text-slate-600">
        Đang tải bản đồ du lịch…
      </div>
    ),
  },
);

const layerLabels: Record<MapLayerId, string> = {
  destinations: "Điểm đến",
  services: "Dịch vụ",
  weather: "Thời tiết",
  traffic: "Giao thông",
  trafficHeatmap: "Heatmap kẹt xe",
  weatherRiskHeatmap: "Heatmap thời tiết",
  route: "Tuyến OSRM",
};

const layerDescriptions: Record<MapLayerId, string> = {
  destinations: "Chỉ hiển thị điểm đang chọn",
  services: "Khách sạn, nhà hàng, tiện ích",
  weather: "Quan trắc theo observed_at",
  traffic: "Tình trạng theo observed_at",
  trafficHeatmap: "Vùng nóng theo mức ùn tắc",
  weatherRiskHeatmap: "Vùng rủi ro theo mưa, gió, nhiệt độ",
  route: "Polyline tuyến đường hiện hành",
};

const explorerLayerVisibility: Record<MapLayerId, boolean> = {
  destinations: true,
  services: false,
  weather: true,
  traffic: true,
  trafficHeatmap: false,
  weatherRiskHeatmap: false,
  route: true,
};

type DetailReturnState = {
  isExplorerOpen: boolean;
  isInspectorOpen: boolean;
  selectedDestinationId: string | null;
  selectedServiceId: string | null;
};

const DEFAULT_EXPLORER_WIDTH = 370;
const DEFAULT_INSPECTOR_WIDTH = 430;
const MIN_PANEL_WIDTH = 320;

function getMaxPanelWidth() {
  if (typeof window === "undefined") return 640;
  return Math.max(MIN_PANEL_WIDTH, Math.floor(window.innerWidth / 2 - 32));
}

function clampPanelWidth(width: number) {
  return Math.min(Math.max(width, MIN_PANEL_WIDTH), getMaxPanelWidth());
}

function formatTimelineTime(timestamp: number | null | undefined) {
  if (!timestamp) return "Chưa có";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatDateInput(timestamp: number | null | undefined) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateRangeStart(value: string) {
  if (!value) return null;
  const time = new Date(`${value}T00:00:00`).getTime();
  return Number.isFinite(time) ? time : null;
}

function parseDateRangeEnd(value: string) {
  if (!value) return null;
  const time = new Date(`${value}T23:59:59.999`).getTime();
  return Number.isFinite(time) ? time : null;
}

function formatObservationClock(value: string | null | undefined) {
  if (!value) return "Chưa có";
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? formatTimelineTime(timestamp) : "Chưa có";
}

function getWeatherTone(weather: WeatherInfo | null): TemporalSignal["tone"] {
  if (!weather) return "muted";
  if (weather.weather_status === "Mưa bão") return "bad";
  if (isRiskyWeather(weather)) return "watch";
  return "good";
}

function getTrafficTone(traffic: TrafficInfo | null): TemporalSignal["tone"] {
  if (!traffic) return "muted";
  if (["Cấm đường", "Ùn tắc"].includes(traffic.congestion_level)) return "bad";
  if (isRiskyTraffic(traffic)) return "watch";
  return "good";
}

function getWeatherSignal(weather: WeatherInfo | null): TemporalSignal {
  if (!weather) {
    return {
      helper: "Chọn điểm khác hoặc mốc giờ khác để xem dữ liệu.",
      tone: "muted",
      value: "Chưa có dữ liệu",
    };
  }

  return {
    helper: `${weather.temperature}°C · ${weather.humidity}% ẩm · ${formatObservationClock(weather.observed_at)}`,
    tone: getWeatherTone(weather),
    value: weather.weather_status,
  };
}

function getTrafficSignal(traffic: TrafficInfo | null): TemporalSignal {
  if (!traffic) {
    return {
      helper: "Chọn điểm khác hoặc mốc giờ khác để xem dữ liệu.",
      tone: "muted",
      value: "Chưa có dữ liệu",
    };
  }

  return {
    helper: `${traffic.status || traffic.description || "Cập nhật giao thông"} · ${formatObservationClock(traffic.observed_at)}`,
    tone: getTrafficTone(traffic),
    value: traffic.congestion_level,
  };
}

function getTravelAdvice(
  weather: WeatherInfo | null,
  traffic: TrafficInfo | null,
): TemporalTravelAdvice {
  const weatherTone = getWeatherTone(weather);
  const trafficTone = getTrafficTone(traffic);

  if (weatherTone === "muted" && trafficTone === "muted") {
    return {
      description: "Chưa đủ dữ liệu để gợi ý. Hãy chọn địa điểm hoặc mốc giờ khác.",
      title: "Chưa đủ dữ liệu",
      tone: "muted",
    };
  }

  if (weatherTone === "bad" || trafficTone === "bad") {
    return {
      description: "Có cảnh báo đáng chú ý. Nên đổi giờ đi hoặc kiểm tra tuyến đường trước khi xuất phát.",
      title: "Nên cân nhắc đổi giờ",
      tone: "bad",
    };
  }

  if (weatherTone === "watch" || trafficTone === "watch") {
    return {
      description: "Vẫn có thể đi, nhưng nên chuẩn bị thêm thời gian và theo dõi tình hình trên bản đồ.",
      title: "Có thể đi, cần chú ý",
      tone: "watch",
    };
  }

  return {
    description: "Thời tiết và giao thông đang ổn cho hành trình tham quan.",
    title: "Phù hợp để đi",
    tone: "good",
  };
}

export function MapExplorerExperience() {
  const { user } = useAuth();
  const { destinations, error, isLoading, services, traffic, weather } = useMapFeatures();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleLayers, setVisibleLayers] = useState(explorerLayerVisibility);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [detailReturnState, setDetailReturnState] = useState<DetailReturnState | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [explorerPanelWidth, setExplorerPanelWidth] = useState(DEFAULT_EXPLORER_WIDTH);
  const [inspectorPanelWidth, setInspectorPanelWidth] = useState(DEFAULT_INSPECTOR_WIDTH);
  const [isPlaying, setIsPlaying] = useState(false);
  const [riskOnly, setRiskOnly] = useState(false);
  const [temporalMode, setTemporalMode] = useState<TemporalMode>("at");
  const [temporalDestinationId, setTemporalDestinationId] = useState<string | null>(null);
  const [temporalStepMinutes, setTemporalStepMinutes] = useState<TemporalStepMinutes>(60);
  const [temporalStartDate, setTemporalStartDate] = useState("");
  const [temporalEndDate, setTemporalEndDate] = useState("");
  const [temporalTimelineKind, setTemporalTimelineKind] = useState<"weather" | "traffic" | null>(null);
  const [detailDialogDestinationId, setDetailDialogDestinationId] = useState<string | null>(null);
  const [timeIndex, setTimeIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const names = new Set<string>();
    destinations.features.forEach((feature) => {
      if (feature.properties.categoryName) names.add(feature.properties.categoryName);
    });
    return ["all", ...Array.from(names)];
  }, [destinations.features]);

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const features = destinations.features.filter((feature) => {
      const category = feature.properties.categoryName || "Khác";
      const text = [
        feature.properties.name,
        feature.properties.provinceName,
        feature.properties.address,
        feature.properties.description,
        category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesCategory = activeCategory === "all" || category === activeCategory;
      return matchesQuery && matchesCategory;
    });

    return {
      ...destinations,
      features,
    } satisfies GeoJsonFeatureCollection<DestinationFeatureProperties>;
  }, [activeCategory, destinations, query]);

  const selectedDestination =
    filteredDestinations.features.find((feature) => feature.properties.id === selectedDestinationId) ||
    filteredDestinations.features[0] ||
    destinations.features[0] ||
    null;
  const focusedDestinations = useMemo(
    () => ({
      ...destinations,
      features: selectedDestination ? [selectedDestination] : [],
    }) satisfies GeoJsonFeatureCollection<DestinationFeatureProperties>,
    [destinations, selectedDestination],
  );
  const selectedService =
    services.features.find((feature) => feature.properties.id === selectedServiceId) || null;
  const hasFocusedDetail = Boolean(selectedDestinationId || selectedServiceId);
  const activeMapDestinationId = selectedDestination?.properties.id ?? null;

  const temporalLocationOptions = useMemo(
    () =>
      destinations.features.map((feature) => ({
        id: feature.properties.id,
        name: feature.properties.name,
        provinceName: feature.properties.provinceName,
      })),
    [destinations.features],
  );
  const activeTemporalDestinationId =
    temporalDestinationId ||
    selectedDestinationId ||
    selectedDestination?.properties.id ||
    temporalLocationOptions[0]?.id ||
    null;
  const activeTemporalDestination =
    temporalLocationOptions.find((option) => option.id === activeTemporalDestinationId) || null;
  const scopedWeather = useMemo(
    () => filterObservationsByDestination(weather, activeTemporalDestinationId),
    [activeTemporalDestinationId, weather],
  );
  const scopedTraffic = useMemo(
    () => filterObservationsByDestination(traffic, activeTemporalDestinationId),
    [activeTemporalDestinationId, traffic],
  );
  const scopedTemporalObservations = [...scopedWeather, ...scopedTraffic];
  const temporalDataTicks = buildTemporalTicks(scopedTemporalObservations);
  const dateRangeMin = formatDateInput(temporalDataTicks[0]);
  const dateRangeMax = formatDateInput(temporalDataTicks[temporalDataTicks.length - 1]);
  const effectiveStartDate = temporalStartDate || dateRangeMin;
  const effectiveEndDate = temporalEndDate || dateRangeMax;
  const temporalTicks = buildSteppedTemporalTicks(scopedTemporalObservations, temporalStepMinutes, {
    endTime: parseDateRangeEnd(effectiveEndDate),
    startTime: parseDateRangeStart(effectiveStartDate),
  });

  const selectedTimeIndex =
    temporalTicks.length === 0
      ? 0
      : Math.min(Math.max(timeIndex ?? temporalTicks.length - 1, 0), temporalTicks.length - 1);
  const selectedTimestamp = temporalTicks[selectedTimeIndex] ?? null;

  useEffect(() => {
    if (!isPlaying || temporalTicks.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setTimeIndex((current) => {
        const currentIndex = current ?? 0;
        const nextIndex = currentIndex + 1;

        if (nextIndex >= temporalTicks.length) {
          window.setTimeout(() => setIsPlaying(false), 0);
          return temporalTicks.length - 1;
        }

        return nextIndex;
      });
    }, 1200);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, temporalTicks.length]);

  const selectedDateLabel =
    temporalMode === "latest"
      ? "Dữ liệu mới nhất"
      : selectedTimestamp === null
      ? "Chưa có dữ liệu thời gian"
      : temporalMode === "cumulative"
        ? `Tích lũy đến ${new Date(selectedTimestamp).toLocaleString("vi-VN")}`
        : new Date(selectedTimestamp).toLocaleString("vi-VN");
  const selectedWeatherObservations = pickTemporalObservations(scopedWeather, selectedTimestamp, temporalMode);
  const visibleWeather = riskOnly
    ? selectedWeatherObservations.filter(isRiskyWeather)
    : selectedWeatherObservations;
  const selectedTrafficObservations = pickTemporalObservations(scopedTraffic, selectedTimestamp, temporalMode);
  const visibleTraffic = riskOnly
    ? selectedTrafficObservations.filter(isRiskyTraffic)
    : selectedTrafficObservations;
  const latestWeatherSignal = pickNewestObservation(visibleWeather);
  const latestTrafficSignal = pickNewestObservation(visibleTraffic);
  const weatherSignal = getWeatherSignal(latestWeatherSignal);
  const trafficSignal = getTrafficSignal(latestTrafficSignal);
  const travelAdvice = getTravelAdvice(latestWeatherSignal, latestTrafficSignal);
  const selectedTimeLabel =
    temporalMode === "latest"
      ? "Mới nhất"
      : selectedTimestamp
        ? formatTimelineTime(selectedTimestamp)
        : "Chưa có dữ liệu";
  const startTimeLabel = formatTimelineTime(temporalTicks[0]);
  const endTimeLabel = formatTimelineTime(temporalTicks[temporalTicks.length - 1]);

  useEffect(() => {
    function handleViewportResize() {
      setExplorerPanelWidth((current) => clampPanelWidth(current));
      setInspectorPanelWidth((current) => clampPanelWidth(current));
    }

    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, []);

  function toggleLayer(layerId: MapLayerId) {
    setVisibleLayers((current) => ({
      ...current,
      [layerId]: !current[layerId],
    }));
  }

  function handleDestinationSelect(destinationId: string) {
    setDetailReturnState({
      isExplorerOpen,
      isInspectorOpen,
      selectedDestinationId,
      selectedServiceId,
    });
    setSelectedDestinationId(destinationId);
    setTemporalDestinationId(destinationId);
    setSelectedServiceId(null);
    setIsExplorerOpen(false);
    setIsInspectorOpen(true);
    setIsPlaying(false);
    setTemporalStartDate("");
    setTemporalEndDate("");
    setTimeIndex(null);
  }

  function handleServiceSelect(serviceId: string) {
    setDetailReturnState({
      isExplorerOpen,
      isInspectorOpen,
      selectedDestinationId,
      selectedServiceId,
    });
    setSelectedDestinationId(null);
    setSelectedServiceId(serviceId);
    setIsExplorerOpen(false);
    setIsInspectorOpen(true);
  }

  function handleDetailBack() {
    if (!detailReturnState) {
      setSelectedDestinationId(null);
      setSelectedServiceId(null);
      setIsExplorerOpen(true);
      return;
    }

    setSelectedDestinationId(detailReturnState.selectedDestinationId);
    setSelectedServiceId(detailReturnState.selectedServiceId);
    setIsExplorerOpen(detailReturnState.isExplorerOpen);
    setIsInspectorOpen(detailReturnState.isInspectorOpen);
    setDetailReturnState(null);
  }

  function handleTemporalPlayToggle() {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (temporalTicks.length < 2) return;

    if (selectedTimeIndex >= temporalTicks.length - 1) {
      setTimeIndex(0);
    }
    setIsPlaying(true);
  }

  function handleTemporalStartDateChange(value: string) {
    setTemporalStartDate(value);
    if (temporalEndDate && value && value > temporalEndDate) {
      setTemporalEndDate(value);
    }
    setIsPlaying(false);
    setTimeIndex(0);
  }

  function handleTemporalEndDateChange(value: string) {
    setTemporalEndDate(value);
    if (temporalStartDate && value && value < temporalStartDate) {
      setTemporalStartDate(value);
    }
    setIsPlaying(false);
    setTimeIndex(0);
  }

  function handlePanelResizeStart(
    panel: "explorer" | "inspector",
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;

    event.preventDefault();
    const startX = event.clientX;
    const startWidth = panel === "explorer" ? explorerPanelWidth : inspectorPanelWidth;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    function handlePointerMove(moveEvent: PointerEvent) {
      const delta = moveEvent.clientX - startX;
      const nextWidth = panel === "explorer"
        ? startWidth + delta
        : startWidth - delta;

      if (panel === "explorer") {
        setExplorerPanelWidth(clampPanelWidth(nextWidth));
      } else {
        setInspectorPanelWidth(clampPanelWidth(nextWidth));
      }
    }

    function handlePointerUp() {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  }

  const explorerPanelStyle = {
    "--explorer-panel-width": `${explorerPanelWidth}px`,
  } as CSSProperties;
  const inspectorPanelStyle = {
    "--inspector-panel-width": `${inspectorPanelWidth}px`,
  } as CSSProperties;

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-surface-container px-4">
        <div className="rounded-lg border border-white/70 bg-white/85 px-5 py-4 text-sm font-semibold text-slate-600 shadow-brand-map">
          Đang tải dữ liệu GIS từ hệ thống…
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-surface-container px-4">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-surface-container">
      <TourismLeafletMap
        className="absolute inset-0 z-0"
        destinations={focusedDestinations}
        services={services}
        traffic={visibleTraffic}
        weather={visibleWeather}
        selectedDestinationId={activeMapDestinationId}
        showLayerPanel={false}
        variant="workspace"
        visibleLayers={visibleLayers}
        onDestinationSelect={handleDestinationSelect}
        onServiceSelect={handleServiceSelect}
      />

      <header className="fixed left-3 right-3 top-3 z-[1200] flex flex-col gap-3 rounded-lg border border-white/70 bg-white/85 px-4 py-3 shadow-brand-map backdrop-blur-xl lg:left-5 lg:right-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-3 font-semibold text-brand-secondary">
          <span className="grid size-9 place-items-center rounded-full bg-brand-primary text-white">
            <MapPinned className="size-5" aria-hidden="true" />
          </span>
          <span>Central Heritage GIS</span>
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-[#6a6a6a]" aria-label="Điều hướng WebGIS">
          <Link className="rounded-full bg-white px-3 py-2 text-brand-secondary shadow-[var(--shadow-brand-map)]" href="/map">
            Bản đồ
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/route">
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
          <Button asChild size="sm" variant="outline" className="min-h-10 rounded-lg bg-white">
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              User space
            </Link>
          </Button>
          <Button asChild size="sm" className="min-h-10 rounded-lg">
            <Link href="/route">
              <Navigation className="size-4" aria-hidden="true" />
              Tạo lộ trình
            </Link>
          </Button>
        </div>
      </header>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="fixed left-3 top-24 z-[1110] rounded-lg bg-white lg:left-5"
        onClick={() => setIsExplorerOpen((current) => !current)}
      >
        {isExplorerOpen ? <PanelLeftClose className="size-4" aria-hidden="true" /> : <PanelLeftOpen className="size-4" aria-hidden="true" />}
        Explorer
      </Button>

      <aside className={cn(
        "fixed bottom-4 left-3 right-3 z-[1100] overflow-visible rounded-lg border border-white/70 bg-white/90 shadow-brand-map backdrop-blur-xl transition-transform lg:bottom-auto lg:left-5 lg:right-auto lg:top-36 lg:w-[var(--explorer-panel-width)] lg:min-w-[320px] lg:max-w-[calc(50vw-2rem)]",
        !isExplorerOpen && "-translate-x-[calc(100%+2rem)]",
      )} style={explorerPanelStyle}>
        <button
          type="button"
          aria-label="Kéo giãn Explorer"
          className="absolute right-0 top-0 z-20 hidden h-full w-4 translate-x-1/2 cursor-col-resize touch-none items-center justify-center rounded-r-lg text-slate-400 transition-colors hover:bg-brand-secondary/10 hover:text-brand-secondary lg:flex"
          onPointerDown={(event) => handlePanelResizeStart("explorer", event)}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
        <div className="max-h-[42vh] overflow-auto rounded-lg lg:max-h-[calc(100vh-9rem)]">
          <div className="border-b border-slate-200/80 p-5">
            <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-primary">
              Explorer
            </p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">
              Khám phá điểm đến
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {filteredDestinations.features.length} kết quả phù hợp. Bản đồ chỉ hiển thị điểm đang chọn.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase text-slate-500">
                Tìm kiếm
              </span>
              <span className="flex min-h-11 items-center gap-2 rounded-lg border border-brand-outline-variant bg-white px-3 focus-within:border-brand-secondary focus-within:ring-2 focus-within:ring-brand-secondary/10">
                <Search className="size-4 text-slate-400" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  placeholder="Đại Nội, biển, hầm, chùa…"
                  type="search"
                />
              </span>
            </label>

          <section>
            <h2 className="text-xs font-extrabold uppercase text-slate-500">Danh mục</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "min-h-9 rounded-full border px-3 text-sm font-bold transition-colors",
                    activeCategory === category
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-brand-outline-variant bg-white text-[#6a6a6a] hover:border-brand-secondary hover:bg-brand-surface-low",
                  )}
                >
                  {category === "all" ? "Tất cả" : category}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-extrabold uppercase text-slate-500">Địa điểm phù hợp</h2>
              <span className="text-xs font-bold text-brand-secondary">
                Đang xem 1 điểm
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              {filteredDestinations.features.length === 0 ? (
                <div className="rounded-lg border border-dashed border-brand-outline-variant bg-brand-surface-low p-3 text-sm text-slate-600">
                  Không tìm thấy địa điểm phù hợp.
                </div>
              ) : (
                filteredDestinations.features.slice(0, 6).map((feature) => {
                  const isActive = feature.properties.id === activeMapDestinationId;

                  return (
                    <button
                      key={feature.properties.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleDestinationSelect(feature.properties.id)}
                      className={cn(
                        "flex min-h-14 items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
                        isActive
                          ? "border-brand-primary bg-brand-gis-soft"
                          : "border-brand-outline-variant bg-white hover:border-brand-secondary hover:bg-brand-surface-low",
                      )}
                    >
                      <span className={cn(
                        "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full",
                        isActive ? "bg-brand-primary text-white" : "bg-brand-surface-low text-brand-secondary",
                      )}>
                        <MapPinned className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold text-slate-950">
                          {feature.properties.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">
                          {feature.properties.provinceName}
                          {feature.properties.categoryName ? ` · ${feature.properties.categoryName}` : ""}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-extrabold uppercase text-slate-500">Lớp dữ liệu</h2>
            <div className="mt-3 grid gap-2">
              {(Object.keys(layerLabels) as MapLayerId[]).map((layerId) => (
                <button
                  key={layerId}
                  type="button"
                  aria-pressed={visibleLayers[layerId]}
                  onClick={() => toggleLayer(layerId)}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-brand-outline-variant bg-white px-3 text-left transition-colors hover:border-brand-secondary hover:bg-brand-surface-low"
                >
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{layerLabels[layerId]}</span>
                    <span className="block text-xs text-slate-500">{layerDescriptions[layerId]}</span>
                  </span>
                  <span
                    className={cn(
                      "h-5 w-9 rounded-full p-0.5 transition-colors",
                      visibleLayers[layerId] ? "bg-brand-gis" : "bg-slate-300",
                    )}
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        "block size-4 rounded-full bg-white transition-transform",
                        visibleLayers[layerId] && "translate-x-4",
                      )}
                    />
                  </span>
                </button>
              ))}
            </div>
          </section>

          <TemporalControlPanel
            advice={travelAdvice}
            dateRangeEnd={effectiveEndDate}
            dateRangeMax={dateRangeMax}
            dateRangeMin={dateRangeMin}
            dateRangeStart={effectiveStartDate}
            endTimeLabel={endTimeLabel}
            isPlaying={isPlaying}
            locationOptions={temporalLocationOptions}
            riskOnly={riskOnly}
            selectedDateLabel={selectedDateLabel}
            selectedLocationId={activeTemporalDestinationId ?? ""}
            selectedLocationName={activeTemporalDestination?.name ?? ""}
            selectedTimeLabel={selectedTimeLabel}
            startTimeLabel={startTimeLabel}
            stepMinutes={temporalStepMinutes}
            temporalMode={temporalMode}
            tickCount={temporalTicks.length}
            timeIndex={selectedTimeIndex}
            trafficCount={visibleTraffic.length}
            trafficSignal={trafficSignal}
            weatherCount={visibleWeather.length}
            weatherSignal={weatherSignal}
            onDateRangeEndChange={handleTemporalEndDateChange}
            onDateRangeStartChange={handleTemporalStartDateChange}
            onLocationChange={(destinationId) => {
              setTemporalDestinationId(destinationId || null);
              setSelectedDestinationId(destinationId || null);
              setSelectedServiceId(null);
              setIsPlaying(false);
              setTemporalStartDate("");
              setTemporalEndDate("");
              setTimeIndex(null);
            }}
            onPlayToggle={handleTemporalPlayToggle}
            onRiskOnlyChange={setRiskOnly}
            onStepMinutesChange={(nextStepMinutes) => {
              setTemporalStepMinutes(nextStepMinutes);
              setIsPlaying(false);
              setTimeIndex(null);
            }}
            onTrafficDetailOpen={() => setTemporalTimelineKind("traffic")}
            onTemporalModeChange={(nextMode) => {
              setTemporalMode(nextMode);
              if (nextMode === "latest") setIsPlaying(false);
            }}
            onTimeIndexChange={(nextTimeIndex) => {
              setIsPlaying(false);
              setTimeIndex(nextTimeIndex);
            }}
            onWeatherDetailOpen={() => setTemporalTimelineKind("weather")}
          />
          </div>
        </div>
      </aside>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="fixed right-5 top-24 z-[1110] hidden rounded-lg bg-white xl:inline-flex"
        onClick={() => setIsInspectorOpen((current) => !current)}
      >
        {isInspectorOpen ? <PanelLeftClose className="size-4" aria-hidden="true" /> : <PanelLeftOpen className="size-4" aria-hidden="true" />}
        Chi tiết
      </Button>

      <aside className={cn(
        "pointer-events-auto fixed bottom-4 left-3 right-3 z-[1100] overflow-visible rounded-lg border border-white/70 bg-white/90 shadow-brand-map backdrop-blur-xl transition-transform xl:bottom-auto xl:left-auto xl:right-5 xl:top-36 xl:block xl:w-[var(--inspector-panel-width)] xl:min-w-[320px] xl:max-w-[calc(50vw-2rem)]",
        !hasFocusedDetail && "hidden",
        !isInspectorOpen && "translate-x-[calc(100%+2rem)]",
      )} style={inspectorPanelStyle}>
        <button
          type="button"
          aria-label="Kéo giãn Chi tiết"
          className="absolute left-0 top-0 z-20 hidden h-full w-4 -translate-x-1/2 cursor-col-resize touch-none items-center justify-center rounded-l-lg text-slate-400 transition-colors hover:bg-brand-secondary/10 hover:text-brand-secondary xl:flex"
          onPointerDown={(event) => handlePanelResizeStart("inspector", event)}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
        <div className="max-h-[58vh] overflow-auto rounded-lg xl:max-h-[calc(100vh-9rem)]">
          {selectedService ? (
            <ServiceInspector
              service={selectedService.properties}
              canGoBack={Boolean(detailReturnState)}
              onBack={handleDetailBack}
            />
          ) : selectedDestination ? (
            <DestinationInspector
              destination={selectedDestination.properties}
              canGoBack={Boolean(detailReturnState)}
              onBack={handleDetailBack}
              onOpenDetail={() => setDetailDialogDestinationId(selectedDestination.properties.id)}
            />
          ) : (
            <div className="p-5 text-sm text-slate-600">Chưa có điểm đến để hiển thị.</div>
          )}
        </div>
      </aside>

      <div className="fixed bottom-4 right-4 z-[1050] hidden rounded-lg border border-white/70 bg-white/90 p-3 text-xs font-bold text-slate-600 shadow-brand-map backdrop-blur-xl md:block">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-brand-primary" aria-hidden="true" />
          {Object.values(visibleLayers).filter(Boolean).length} lớp đang bật
        </div>
      </div>
      <MapLegend visibleLayers={visibleLayers} />
      <DestinationDetailDialog
        destinationId={detailDialogDestinationId}
        fallbackDestination={selectedDestination?.properties ?? null}
        onOpenChange={(open) => {
          if (!open) setDetailDialogDestinationId(null);
        }}
      />
      <TemporalTimelineDialog
        kind={temporalTimelineKind}
        locationName={activeTemporalDestination?.name ?? ""}
        traffic={scopedTraffic}
        weather={scopedWeather}
        onOpenChange={(open) => {
          if (!open) setTemporalTimelineKind(null);
        }}
      />
    </main>
  );
}

function DestinationInspector({
  canGoBack,
  destination,
  onOpenDetail,
  onBack,
}: {
  canGoBack?: boolean;
  destination: DestinationFeatureProperties;
  onOpenDetail: () => void;
  onBack?: () => void;
}) {
  return (
    <div>
      <div className="border-b border-slate-200/80 p-5">
        {canGoBack && onBack ? (
          <Button type="button" size="sm" variant="outline" className="mb-4 min-h-10 rounded-lg bg-white" onClick={onBack}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quay lại
          </Button>
        ) : null}
        <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-heritage">
          Điểm đang chọn
        </p>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">
          {destination.name}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {destination.description || "Thông tin chi tiết sẽ được đồng bộ từ lớp dữ liệu điểm đến."}
        </p>
      </div>

      <div className="border-b border-slate-200/80 p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-heritage-soft px-3 py-1 text-xs font-extrabold text-brand-earth">
            {destination.categoryName || "Điểm du lịch"}
          </span>
          <span className="rounded-full bg-brand-gis-soft px-3 py-1 text-xs font-extrabold text-brand-gis">
            {destination.provinceName}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <FactCard icon={Star} label="Đánh giá" value={String(destination.rating || "N/A")} />
          <FactCard icon={Clock} label="Mã tỉnh" value={destination.provinceCode} />
          <FactCard icon={LocateFixed} label="Nguồn" value="PostGIS" />
          <FactCard icon={Layers} label="Lớp" value="GeoJSON" />
        </div>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-base font-extrabold text-slate-950">Hành động đề xuất</h3>
        <p className="text-sm leading-6 text-slate-600">
          Mở chi tiết điểm đến, thêm vào tuyến tham quan, hoặc chia sẻ góc nhìn bản đồ hiện tại.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" className="rounded-lg" onClick={onOpenDetail}>
              Mở chi tiết
              <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-lg bg-white">
            <Link href={`/route?end=${destination.id}`}>
              Thêm vào tuyến
            </Link>
          </Button>
          <Button type="button" size="sm" variant="ghost" className="rounded-lg">
            <Share2 className="size-4" aria-hidden="true" />
            Chia sẻ
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServiceInspector({
  canGoBack,
  onBack,
  service,
}: {
  canGoBack?: boolean;
  onBack?: () => void;
  service: ServiceFeatureProperties;
}) {
  return (
    <div>
      <div className="border-b border-slate-200/80 p-5">
        {canGoBack && onBack ? (
          <Button type="button" size="sm" variant="outline" className="mb-4 min-h-10 rounded-lg bg-white" onClick={onBack}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quay lại
          </Button>
        ) : null}
        <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-gis">
          Dịch vụ hỗ trợ
        </p>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">
          {service.name}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {service.description || service.address || "Thông tin dịch vụ hỗ trợ cho hành trình du lịch."}
        </p>
      </div>

      <div className="border-b border-slate-200/80 p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-gis-soft px-3 py-1 text-xs font-extrabold text-brand-gis">
            {service.type.replace("_", " ")}
          </span>
          <span className="rounded-full bg-brand-heritage-soft px-3 py-1 text-xs font-extrabold text-brand-earth">
            {service.provinceName}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <FactCard icon={Star} label="Đánh giá" value={String(service.rating || "N/A")} />
          <FactCard icon={Clock} label="Mã tỉnh" value={service.provinceCode} />
          <FactCard icon={LocateFixed} label="Loại" value={service.type.replace("_", " ")} />
          <FactCard icon={Layers} label="Lớp" value="Service" />
        </div>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-base font-extrabold text-slate-950">Thông tin liên hệ</h3>
        <div className="grid gap-2 text-sm text-slate-600">
          <p className="rounded-lg bg-brand-surface-low px-3 py-2">
            {service.address || "Chưa có địa chỉ chi tiết."}
          </p>
          <p className="rounded-lg bg-brand-surface-low px-3 py-2">
            {service.phone || "Chưa có số điện thoại."}
          </p>
        </div>
      </div>
    </div>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-brand-surface-low p-3">
      <Icon className="size-4 text-brand-primary" aria-hidden="true" />
      <strong className="mt-2 block truncate font-mono text-base text-slate-950">{value}</strong>
      <span className="mt-1 block text-xs font-semibold text-slate-500">{label}</span>
    </div>
  );
}
