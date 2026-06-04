"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  MapPinned,
  MessageSquare,
  Store,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import {
  mockTraffic,
} from "@/lib/admin-data";
import {
  getAdminDashboardStats,
  getAdminDestinationMix,
  getAdminDestinations,
  getAdminRouteDemand,
  type AdminDashboardStats,
  type AdminDestination,
  type AdminDestinationMix,
  type AdminRouteDemand,
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>(emptyStats);
  const [demandRows, setDemandRows] = useState<AdminRouteDemand[]>([]);
  const [destinationMix, setDestinationMix] = useState<AdminDestinationMix[]>([]);
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);
        const [nextStats, nextDemand, nextMix, nextDestinations] = await Promise.all([
          getAdminDashboardStats(),
          getAdminRouteDemand(),
          getAdminDestinationMix(),
          getAdminDestinations(),
        ]);

        if (!isMounted) return;
        setStats(nextStats);
        setDemandRows(nextDemand);
        setDestinationMix(nextMix);
        setDestinations(nextDestinations);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu admin.");
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

  const statCards = [
    {
      title: "Điểm du lịch",
      value: stats.destinations,
      subValue: `${stats.activeDestinations} đang hoạt động`,
      icon: MapPinned,
      tone: "text-brand-primary bg-blue-50 border-blue-200",
    },
    {
      title: "Dịch vụ hỗ trợ",
      value: stats.services,
      subValue: "Khách sạn, nhà hàng, tiện ích",
      icon: Store,
      tone: "text-brand-gis bg-brand-gis-soft border-emerald-200",
    },
    {
      title: "Đánh giá",
      value: stats.reviews,
      subValue: `${stats.pendingReviews} đang chờ duyệt`,
      icon: MessageSquare,
      tone: "text-brand-heritage bg-brand-heritage-soft border-amber-200",
    },
    {
      title: "Thông báo",
      value: stats.notifications,
      subValue: "Đang hiển thị",
      icon: Bell,
      tone: "text-brand-success bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="relative -m-4 min-h-[calc(100vh-4rem)] overflow-hidden bg-brand-surface-container p-4 sm:-m-6 sm:p-6 lg:-m-8 lg:p-8">
      <MapBackdrop />

      <div className="relative z-10 grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-white/70 bg-white/85 shadow-brand-map backdrop-blur-xl">
          <div className="border-b border-slate-200/80 p-5">
            <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-primary">
              Admin
            </p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">
              Tourism operations
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Quản trị điểm đến, dịch vụ, đánh giá và cảnh báo không gian.
            </p>
          </div>
          <nav className="grid gap-2 p-3 text-sm font-extrabold text-slate-600" aria-label="Admin sections">
            <AdminNavItem active label="Overview" value="12" />
            <AdminNavItem label="Destinations" value={String(stats.destinations)} />
            <AdminNavItem label="Services" value={String(stats.services)} />
            <AdminNavItem label="Reviews" value={String(stats.pendingReviews)} />
            <AdminNavItem label="Spatial analytics" value="Live" />
          </nav>
        </aside>

        <main className="grid gap-5">
          {isLoading ? (
            <div className="rounded-lg border border-white/70 bg-white/85 p-5 text-sm font-semibold text-slate-600 shadow-brand-map backdrop-blur-xl">
              Đang tải dashboard admin từ API...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 shadow-brand-map">
              {error}
            </div>
          ) : null}

          <section className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-brand-map backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-primary">
                  Spatial intelligence
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                  Trung tâm điều hành du lịch miền Trung
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Theo dõi chất lượng dữ liệu, nhu cầu lập tuyến, cảnh báo giao thông và hàng đợi duyệt nội dung.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Hôm nay", "7 ngày", "30 ngày"].map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    className={cn(
                      "min-h-10 rounded-full border px-4 text-sm font-extrabold transition-colors",
                      index === 0
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-primary hover:bg-blue-50",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <article
                  key={stat.title}
                  className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-brand-map backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase text-slate-500">{stat.title}</p>
                      <strong className="mt-3 block font-mono text-3xl text-slate-950">{stat.value}</strong>
                      <p className="mt-2 text-xs font-semibold text-slate-500">{stat.subValue}</p>
                    </div>
                    <span className={cn("grid size-11 place-items-center rounded-lg border", stat.tone)}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <article className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-brand-map backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950">Nhu cầu lập tuyến theo vùng</h3>
                  <p className="mt-1 text-sm text-slate-600">Tổng hợp ý định di chuyển từ các phiên bản đồ.</p>
                </div>
                <span className="rounded-full bg-brand-gis-soft px-3 py-1 text-xs font-extrabold text-brand-gis">
                  Live
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                {demandRows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[120px_minmax(0,1fr)_48px] items-center gap-3 text-sm">
                    <span className="font-semibold text-slate-600">{row.label}</span>
                    <span className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-gis"
                        style={{ width: `${row.value}%` }}
                      />
                    </span>
                    <strong className="font-mono text-slate-950">{row.value}%</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-brand-map backdrop-blur-xl">
              <h3 className="text-lg font-extrabold text-slate-950">Cơ cấu dữ liệu điểm đến</h3>
              <div className="mx-auto my-6 grid size-44 place-items-center rounded-full bg-[conic-gradient(#00355f_0_46%,#21835f_46%_72%,#a87922_72%_88%,#d8dee6_88%_100%)]">
                <div className="grid size-28 place-items-center rounded-full bg-white">
                  <strong className="font-mono text-3xl text-slate-950">{stats.destinations}</strong>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {destinationMix.slice(0, 4).map((item, index) => (
                  <span
                    key={item.label}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-extrabold",
                      index === 0 && "bg-blue-50 text-brand-primary",
                      index === 1 && "bg-brand-gis-soft text-brand-gis",
                      index >= 2 && "bg-brand-heritage-soft text-brand-earth",
                    )}
                  >
                    {item.label} {item.count}
                  </span>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <article className="overflow-hidden rounded-lg border border-white/70 bg-white/88 shadow-brand-map backdrop-blur-xl">
              <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950">Hàng đợi xuất bản điểm đến</h3>
                  <p className="mt-1 text-sm text-slate-600">Duyệt thay đổi đã xác minh và gắn cờ lỗi không gian.</p>
                </div>
                <Button size="sm" className="rounded-lg">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Duyệt nhanh
                </Button>
              </div>
              <div className="overflow-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="px-5 py-3">Điểm đến</th>
                      <th className="px-5 py-3">Vùng</th>
                      <th className="px-5 py-3">Loại</th>
                      <th className="px-5 py-3">Trạng thái</th>
                      <th className="px-5 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.slice(0, 4).map((destination) => (
                      <tr key={destination.id} className="border-b border-slate-100 text-sm last:border-b-0">
                        <td className="px-5 py-4">
                          <strong className="block text-slate-950">{destination.name}</strong>
                          <span className="text-xs text-slate-500">{destination.address}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{destination.provinceName}</td>
                        <td className="px-5 py-4 text-slate-600">{destination.categoryName || "Khác"}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status="active" />
                        </td>
                        <td className="px-5 py-4">
                          <Button type="button" size="sm" variant="outline" className="rounded-lg bg-white">
                            Kiểm tra
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-lg border border-white/70 bg-white/88 p-5 shadow-brand-map backdrop-blur-xl">
              <h3 className="text-lg font-extrabold text-slate-950">Spatial alert feed</h3>
              <div className="mt-5 grid gap-3">
                {mockTraffic.map((traffic) => (
                  <div key={traffic.id} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-slate-950">{traffic.road_name}</strong>
                      <TrafficBadge level={traffic.congestion_level} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{traffic.description}</p>
                  </div>
                ))}
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm text-slate-950">Review pattern</strong>
                    <span className="rounded-full bg-brand-gis-soft px-2 py-1 text-xs font-extrabold text-brand-gis">
                      Stable
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {stats.pendingReviews} đánh giá cần kiểm duyệt trước khi hiển thị.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

function AdminNavItem({ active = false, label, value }: { active?: boolean; label: string; value: string }) {
  return (
    <a
      href="#"
      className={cn(
        "flex min-h-10 items-center justify-between rounded-lg px-3 transition-colors",
        active ? "bg-brand-surface-container text-slate-950" : "hover:bg-brand-surface-container",
      )}
    >
      <span>{label}</span>
      <span className="text-xs text-slate-500">{value}</span>
    </a>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "active"
      ? "bg-brand-gis-soft text-brand-gis"
      : status === "pending"
        ? "bg-brand-heritage-soft text-brand-earth"
        : "bg-slate-100 text-slate-600";

  return <span className={cn("rounded-full px-2 py-1 text-xs font-extrabold", className)}>{status}</span>;
}

function TrafficBadge({ level }: { level: string }) {
  const className =
    level === "high" || level === "blocked"
      ? "bg-red-50 text-brand-danger"
      : level === "medium"
        ? "bg-brand-heritage-soft text-brand-earth"
        : "bg-brand-gis-soft text-brand-gis";

  return (
    <span className={cn("rounded-full px-2 py-1 text-xs font-extrabold", className)}>
      {level}
    </span>
  );
}

function MapBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_31px,rgb(14_116_144_/_0.16)_32px,transparent_33px),linear-gradient(transparent_31px,rgb(14_116_144_/_0.12)_32px,transparent_33px),radial-gradient(circle_at_70%_18%,rgb(186_230_253_/_0.7),transparent_23%),radial-gradient(circle_at_42%_45%,rgb(187_247_208_/_0.65),transparent_26%),linear-gradient(142deg,#e8f3f3,#f8f9fa)] bg-[size:64px_64px,64px_64px,auto,auto,auto]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
        <path
          d="M120 76 C214 148 274 226 356 292 C452 370 526 426 600 504 C672 580 752 636 886 654"
          fill="none"
          stroke="#00355f"
          strokeLinecap="round"
          strokeWidth="14"
          opacity="0.28"
        />
        <path
          d="M172 132 C242 210 334 246 452 320 C550 382 642 464 754 570"
          fill="none"
          stroke="#21835f"
          strokeDasharray="12 14"
          strokeLinecap="round"
          strokeWidth="5"
          opacity="0.38"
        />
      </svg>
      <div className="absolute left-[18%] top-[16%] h-24 w-36 rounded-lg border border-brand-heritage/40 bg-brand-heritage/10" />
      <div className="absolute left-[47%] top-[42%] h-24 w-36 rounded-lg border border-brand-heritage/40 bg-brand-heritage/10" />
      <div className="absolute left-[38%] top-[50%] h-2 w-80 rotate-[28deg] rounded-full bg-gradient-to-r from-brand-success via-brand-warning to-brand-danger" />
      <BackdropPoint className="left-[19%] top-[18%] bg-brand-heritage" label="Quảng Trị" />
      <BackdropPoint className="left-[49%] top-[45%] bg-brand-primary" label="Huế" />
      <BackdropPoint className="left-[77%] top-[72%] bg-brand-gis" label="Đà Nẵng" />
    </div>
  );
}

function BackdropPoint({ className, label }: { className: string; label: string }) {
  return (
    <div className={cn("absolute", className)}>
      <span className="block size-4 rounded-full border-4 border-white shadow-lg" />
      <span className="absolute left-5 top-[-10px] rounded-lg border border-white/70 bg-white/80 px-3 py-2 text-xs font-extrabold text-slate-900 shadow-sm">
        {label}
      </span>
    </div>
  );
}
