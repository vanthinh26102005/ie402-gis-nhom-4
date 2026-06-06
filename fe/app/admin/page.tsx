"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  MapPinned,
  MessageSquareText,
  Store,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import {
  getAdminDashboardStats,
  getAdminDestinationMix,
  getAdminDestinations,
  getAdminDataCoverage,
  getAdminReviews,
  getAdminRouteDemand,
  getAdminServices,
  getAdminTrafficStats,
  getAdminWeatherStats,
  type AdminDashboardStats,
  type AdminDataCoverage,
  type AdminDestination,
  type AdminDestinationMix,
  type AdminReview,
  type AdminRouteDemand,
  type AdminService,
  type AdminTrafficStats,
  type AdminWeatherStats,
} from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const emptyStats: AdminDashboardStats = {
  destinations: 0,
  services: 0,
  reviews: 0,
  notifications: 0,
  pendingReviews: 0,
  activeDestinations: 0,
};

const emptyWeatherStats: AdminWeatherStats = {
  avgHumidity: null,
  avgTemperature: null,
  byDay: [],
  byProvince: [],
  byStatus: [],
  latestObservedAt: null,
  total: 0,
};

const emptyTrafficStats: AdminTrafficStats = {
  avgCongestionLevel: null,
  byDay: [],
  byLevel: [],
  byProvince: [],
  highRiskCount: 0,
  latestObservedAt: null,
  total: 0,
};

const emptyCoverage: AdminDataCoverage = {
  destinations: 0,
  freshnessHours: 24,
  missingTraffic: 0,
  missingWeather: 0,
  trafficCovered: 0,
  trafficFresh: 0,
  trafficFreshRate: 0,
  weatherCovered: 0,
  weatherFresh: 0,
  weatherFreshRate: 0,
};

type DashboardState = {
  destinations: AdminDestination[];
  destinationMix: AdminDestinationMix[];
  reviews: AdminReview[];
  routeDemand: AdminRouteDemand[];
  services: AdminService[];
  stats: AdminDashboardStats;
  trafficStats: AdminTrafficStats;
  weatherStats: AdminWeatherStats;
  coverage: AdminDataCoverage;
};

const emptyDashboard: DashboardState = {
  destinations: [],
  destinationMix: [],
  reviews: [],
  routeDemand: [],
  services: [],
  stats: emptyStats,
  trafficStats: emptyTrafficStats,
  weatherStats: emptyWeatherStats,
  coverage: emptyCoverage,
};

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardState>(emptyDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);
        const [
          stats,
          routeDemand,
          destinationMix,
          destinations,
          services,
          reviews,
          weatherStats,
          trafficStats,
          coverage,
        ] =
          await Promise.all([
            getAdminDashboardStats(),
            getAdminRouteDemand(),
            getAdminDestinationMix(),
            getAdminDestinations(),
            getAdminServices(),
            getAdminReviews(),
            getAdminWeatherStats(),
            getAdminTrafficStats(),
            getAdminDataCoverage(24),
          ]);

        if (!isMounted) return;
        setDashboard({
          destinations,
          destinationMix,
          reviews,
          routeDemand,
          services,
          stats,
          trafficStats,
          weatherStats,
          coverage,
        });
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải dashboard admin.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingReviews = useMemo(
    () => dashboard.reviews.filter((review) => review.status === "pending"),
    [dashboard.reviews],
  );
  const dataQuality = useMemo(() => buildDataQualityRows(dashboard), [dashboard]);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-primary">
            Dashboard vận hành
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            Trung tâm quản trị dữ liệu du lịch GIS
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Theo dõi dữ liệu điểm đến, dịch vụ hỗ trợ, hàng đợi review và các vùng có nhiều điểm cần kiểm tra.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/destinations/new">
              <MapPinned className="size-4" aria-hidden="true" />
              Thêm điểm đến
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/reviews">
              Duyệt review
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={MapPinned}
          label="Điểm du lịch"
          value={dashboard.stats.destinations}
          helper={`${dashboard.stats.activeDestinations} điểm đang hiển thị`}
          tone="blue"
        />
        <MetricCard
          icon={Store}
          label="Dịch vụ hỗ trợ"
          value={dashboard.stats.services}
          helper={`${dashboard.services.length} bản ghi quản trị`}
          tone="emerald"
        />
        <MetricCard
          icon={MessageSquareText}
          label="Đánh giá"
          value={dashboard.stats.reviews}
          helper={`${dashboard.stats.pendingReviews} cần duyệt`}
          tone="amber"
        />
        <MetricCard
          icon={Bell}
          label="Thông báo"
          value={dashboard.stats.notifications}
          helper="Cảnh báo đang active"
          tone="rose"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={AlertTriangle}
          label="Quan trắc thời tiết"
          value={dashboard.weatherStats.total}
          helper={`TB ${dashboard.weatherStats.avgTemperature ?? "-"}°C`}
          tone="rose"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Quan trắc giao thông"
          value={dashboard.trafficStats.total}
          helper={`${dashboard.trafficStats.highRiskCount} bản ghi rủi ro cao`}
          tone="amber"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Weather freshness"
          value={dashboard.coverage.weatherFreshRate}
          helper={`${dashboard.coverage.weatherFresh}/${dashboard.coverage.destinations} điểm trong 24h`}
          suffix="%"
          tone="emerald"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Traffic freshness"
          value={dashboard.coverage.trafficFreshRate}
          helper={`${dashboard.coverage.trafficFresh}/${dashboard.coverage.destinations} điểm trong 24h`}
          suffix="%"
          tone="blue"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <Panel
          title="Phân bổ điểm đến theo vùng"
          description="Dùng để phát hiện vùng thiếu dữ liệu hoặc quá lệch mẫu."
          actionHref="/admin/destinations"
          actionLabel="Quản lý điểm"
        >
          <div className="grid gap-3">
            {dashboard.routeDemand.map((row) => (
              <BarRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </Panel>

        <Panel
          title="Cơ cấu loại hình"
          description="Kiểm tra nhanh danh mục nào đang thiếu nội dung."
          actionHref="/admin/categories"
          actionLabel="Quản lý loại"
        >
          <div className="grid gap-3">
            {dashboard.destinationMix.slice(0, 6).map((item, index) => (
              <div key={item.label} className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className={cn("size-2.5 rounded-full", dotTone(index))} />
                  {item.label}
                </span>
                <strong className="font-mono text-sm text-slate-950">{item.count}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <Panel
          title="Hàng đợi cần xử lý"
          description="Ưu tiên các bản ghi ảnh hưởng trực tiếp đến niềm tin người dùng."
          actionHref="/admin/reviews"
          actionLabel="Mở review"
        >
          <div className="grid gap-3">
            {pendingReviews.length ? (
              pendingReviews.slice(0, 4).map((review) => (
                <article key={review.id} className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-950">{review.destinationName}</h3>
                      <p className="mt-1 text-xs font-semibold text-amber-800">
                        {review.userName} - {review.score}/5
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="bg-white">
                      <Link href={`/admin/reviews/${review.id}/moderate`}>Duyệt</Link>
                    </Button>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {review.content || "Không có nội dung đánh giá."}
                  </p>
                </article>
              ))
            ) : (
              <EmptyDashboardState text="Không có review pending." />
            )}
          </div>
        </Panel>

        <Panel
          title="Chất lượng dữ liệu"
          description="Các cảnh báo này nên được xử lý trước khi demo hoặc vận hành."
          actionHref="/admin/destinations"
          actionLabel="Kiểm tra"
        >
          <div className="grid gap-3">
            {dataQuality.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
                <span className={cn("mt-0.5 grid size-8 place-items-center rounded-full", item.ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                  {item.ok ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <AlertTriangle className="size-4" aria-hidden="true" />}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-950">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel
        title="Điểm đến cập nhật gần đây"
        description="Dữ liệu lấy từ API admin/PostGIS, không dùng mock dashboard."
        actionHref="/admin/destinations"
        actionLabel="Xem tất cả"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Điểm đến</th>
                <th className="px-4 py-3">Vùng</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Giá vé</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.destinations.slice(0, 6).map((destination) => (
                <tr key={destination.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-4">
                    <strong className="block text-slate-950">{destination.name}</strong>
                    <span className="mt-1 block text-xs text-slate-500">{destination.address || "Chưa có địa chỉ"}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{destination.provinceName || "-"}</td>
                  <td className="px-4 py-4 text-slate-600">{destination.categoryName || "Khác"}</td>
                  <td className="px-4 py-4 font-mono text-slate-700">
                    {Number(destination.ticketPrice || 0).toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-4 py-4">
                    <Button asChild size="sm" variant="outline" className="bg-white">
                      <Link href={`/admin/destinations/${destination.id}/edit`}>Sửa</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function MetricCard({
  helper,
  icon: Icon,
  label,
  tone,
  value,
  suffix = "",
}: {
  helper: string;
  icon: typeof MapPinned;
  label: string;
  suffix?: string;
  tone: "amber" | "blue" | "emerald" | "rose";
  value: number;
}) {
  const toneClass = {
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    blue: "border-brand-outline-variant bg-brand-surface-low text-brand-primary",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  }[tone];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
          <strong className="mt-3 block font-mono text-3xl text-slate-950">
            {value}{suffix}
          </strong>
          <p className="mt-2 text-xs font-semibold text-slate-500">{helper}</p>
        </div>
        <span className={cn("grid size-11 place-items-center rounded-lg border", toneClass)}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function Panel({
  actionHref,
  actionLabel,
  children,
  description,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <Button asChild size="sm" variant="outline" className="bg-white">
          <Link href={actionHref}>
            {actionLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
      {children}
    </section>
  );
}

function BarRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)_52px] items-center gap-3 text-sm">
      <span className="truncate font-semibold text-slate-600">{label}</span>
      <span className="h-3 overflow-hidden rounded-full bg-slate-100">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-gis"
          style={{ width: `${Math.max(4, value)}%` }}
        />
      </span>
      <strong className="text-right font-mono text-slate-950">{value}%</strong>
    </div>
  );
}

function EmptyDashboardState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="h-36 animate-pulse rounded-lg bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg bg-white" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-lg bg-white" />
        <div className="h-72 animate-pulse rounded-lg bg-white" />
      </div>
    </>
  );
}

function buildDataQualityRows(dashboard: DashboardState) {
  const missingAddress = dashboard.destinations.filter((destination) => !destination.address).length;
  const missingCategory = dashboard.destinations.filter((destination) => !destination.categoryName).length;
  const lowServiceCoverage = dashboard.services.length < dashboard.destinations.length;

  return [
    {
      ok: missingAddress === 0,
      label: "Địa chỉ điểm đến",
      description: missingAddress
        ? `${missingAddress} điểm đến chưa có địa chỉ đầy đủ.`
        : "Tất cả điểm đến đang có địa chỉ.",
    },
    {
      ok: missingCategory === 0,
      label: "Phân loại điểm đến",
      description: missingCategory
        ? `${missingCategory} điểm đến chưa gắn loại hình.`
        : "Tất cả điểm đến đã có loại hình.",
    },
    {
      ok: !lowServiceCoverage,
      label: "Dịch vụ hỗ trợ",
      description: lowServiceCoverage
        ? "Số dịch vụ hỗ trợ đang thấp hơn số điểm đến, cần bổ sung khách sạn/nhà hàng/parking."
        : "Mật độ dịch vụ hỗ trợ đủ cho dữ liệu hiện tại.",
    },
    {
      ok: dashboard.coverage.weatherFreshRate >= 60,
      label: "Dữ liệu thời tiết mới",
      description:
        dashboard.coverage.weatherFreshRate >= 60
          ? `${dashboard.coverage.weatherFreshRate}% điểm đến có thời tiết mới trong 24h.`
          : `${dashboard.coverage.missingWeather} điểm chưa có dữ liệu thời tiết hoặc dữ liệu đã cũ.`,
    },
    {
      ok: dashboard.coverage.trafficFreshRate >= 60,
      label: "Dữ liệu giao thông mới",
      description:
        dashboard.coverage.trafficFreshRate >= 60
          ? `${dashboard.coverage.trafficFreshRate}% điểm đến có giao thông mới trong 24h.`
          : `${dashboard.coverage.missingTraffic} điểm chưa có dữ liệu giao thông hoặc dữ liệu đã cũ.`,
    },
  ];
}

function dotTone(index: number) {
  const tones = ["bg-brand-primary", "bg-brand-gis", "bg-brand-heritage", "bg-rose-500"];
  return tones[index % tones.length];
}
