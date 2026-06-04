"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Clock,
  Layers,
  LocateFixed,
  MapPinned,
  Navigation,
  Search,
  Share2,
  Star,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import type { MapLayerId } from "@/components/map/LayerTogglePanel";
import { useMapFeatures } from "@/lib/hooks/useMapFeatures";
import type { DestinationFeatureProperties } from "@/lib/types/destination";
import type { GeoJsonFeatureCollection } from "@/lib/types/geojson";
import { cn } from "@/lib/utils";

const TourismLeafletMap = dynamic(
  () => import("@/components/map/TourismLeafletMap").then((mod) => mod.TourismLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-screen place-items-center bg-brand-surface-container text-sm font-semibold text-slate-600">
        Đang tải bản đồ du lịch...
      </div>
    ),
  },
);

const layerLabels: Record<MapLayerId, string> = {
  destinations: "Điểm đến",
  services: "Dịch vụ",
  route: "Tuyến OSRM",
};

const layerDescriptions: Record<MapLayerId, string> = {
  destinations: "Marker du lịch từ PostGIS",
  services: "Khách sạn, nhà hàng, tiện ích",
  route: "Polyline tuyến đường hiện hành",
};

const explorerLayerVisibility: Record<MapLayerId, boolean> = {
  destinations: true,
  services: true,
  route: true,
};

export function MapExplorerExperience() {
  const { destinations, error, isLoading, services } = useMapFeatures();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleLayers, setVisibleLayers] = useState(explorerLayerVisibility);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

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

  function toggleLayer(layerId: MapLayerId) {
    setVisibleLayers((current) => ({
      ...current,
      [layerId]: !current[layerId],
    }));
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-surface-container px-4">
        <div className="rounded-lg border border-white/70 bg-white/85 px-5 py-4 text-sm font-semibold text-slate-600 shadow-brand-map">
          Đang tải dữ liệu GIS từ hệ thống...
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
        destinations={filteredDestinations}
        services={services}
        selectedDestinationId={selectedDestination?.properties.id}
        showLayerPanel={false}
        variant="workspace"
        visibleLayers={visibleLayers}
        onDestinationSelect={setSelectedDestinationId}
      />

      <header className="fixed left-3 right-3 top-3 z-[1200] flex flex-col gap-3 rounded-lg border border-white/70 bg-white/85 px-4 py-3 shadow-brand-map backdrop-blur-xl lg:left-5 lg:right-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-3 font-extrabold text-slate-950">
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-gis text-white">
            <MapPinned className="size-5" aria-hidden="true" />
          </span>
          <span>Central Heritage GIS</span>
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm font-bold text-slate-600" aria-label="Điều hướng WebGIS">
          <Link className="rounded-full bg-white px-3 py-2 text-brand-primary shadow-sm" href="/map">
            Bản đồ
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/route">
            Định tuyến
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/destinations">
            Điểm đến
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white" href="/admin">
            Quản trị
          </Link>
        </nav>
        <Button asChild size="sm" className="min-h-10 rounded-lg">
          <Link href="/route">
            <Navigation className="size-4" aria-hidden="true" />
            Tạo lộ trình
          </Link>
        </Button>
      </header>

      <aside className="fixed bottom-4 left-3 right-3 z-[1100] max-h-[42vh] overflow-auto rounded-lg border border-white/70 bg-white/90 shadow-brand-map backdrop-blur-xl lg:bottom-auto lg:left-5 lg:right-auto lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-[370px]">
        <div className="border-b border-slate-200/80 p-5">
          <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-primary">
            Explorer
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">
            Khám phá điểm đến
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {filteredDestinations.features.length} điểm đang hiển thị trên bản đồ du lịch miền Trung.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase text-slate-500">
              Tìm kiếm
            </span>
            <span className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/15">
              <Search className="size-4 text-slate-400" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder="Đại Nội, biển, hầm, chùa..."
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
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-primary hover:bg-blue-50",
                  )}
                >
                  {category === "all" ? "Tất cả" : category}
                </button>
              ))}
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
                  className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 text-left transition-colors hover:border-brand-primary hover:bg-blue-50"
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
        </div>
      </aside>

      <aside className="pointer-events-auto fixed right-5 top-24 z-[1100] hidden max-h-[calc(100vh-7rem)] w-[390px] overflow-auto rounded-lg border border-white/70 bg-white/90 shadow-brand-map backdrop-blur-xl xl:block">
        {selectedDestination ? (
          <DestinationInspector destination={selectedDestination.properties} />
        ) : (
          <div className="p-5 text-sm text-slate-600">Chưa có điểm đến để hiển thị.</div>
        )}
      </aside>

      <div className="fixed bottom-4 right-4 z-[1050] hidden rounded-lg border border-white/70 bg-white/90 p-3 text-xs font-bold text-slate-600 shadow-brand-map backdrop-blur-xl md:block">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-brand-primary" aria-hidden="true" />
          {Object.values(visibleLayers).filter(Boolean).length} lớp đang bật
        </div>
      </div>
    </main>
  );
}

function DestinationInspector({ destination }: { destination: DestinationFeatureProperties }) {
  return (
    <div>
      <div className="border-b border-slate-200/80 p-5">
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
          <Button asChild size="sm" className="rounded-lg">
            <Link href={`/destinations/${destination.id}`}>
              Mở chi tiết
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
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
