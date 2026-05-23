"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserLayout } from "@/components/layout/UserLayout";
import { Select } from "@/components/common/Select";
import { getAllWeather, getAllTraffic, getTrafficAlerts } from "@/lib/api";
import { WeatherInfo, TrafficInfo } from "@/lib/mockData";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  CloudSun,
  AlertTriangle,
  Car,
  Clock,
  Droplets,
  Wind,
  ShieldAlert,
  Filter,
  RefreshCw,
} from "lucide-react";

interface TrafficAlert {
  id: string;
  level: string;
  title: string;
  content: string;
  date: string;
}

export default function WeatherTrafficPage() {
  return (
    <Suspense
      fallback={
        <UserLayout>
          <main className="min-h-screen bg-brand-background py-8 flex items-center justify-center">
            <div className="text-center font-bold text-slate-500">
              <RefreshCw className="size-8 text-brand-primary animate-spin mx-auto mb-2" />
              Đang tải thông tin thời tiết & giao thông...
            </div>
          </main>
        </UserLayout>
      }
    >
      <WeatherTrafficContent />
    </Suspense>
  );
}

function WeatherTrafficContent() {
  const searchParams = useSearchParams();
  const queryProvince = searchParams.get("province") || "";

  const [allWeather, setAllWeather] = useState<WeatherInfo[]>([]);
  const [allTraffic, setAllTraffic] = useState<TrafficInfo[]>([]);
  const [alerts, setAlerts] = useState<TrafficAlert[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState(queryProvince);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  // Sync state if query parameter changes dynamically
  useEffect(() => {
    if (queryProvince) {
      setSelectedProvince(queryProvince);
    }
  }, [queryProvince]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [weatherData, trafficData, alertData] = await Promise.all([
        getAllWeather(),
        getAllTraffic(),
        getTrafficAlerts(),
      ]);

      setAllWeather(weatherData);
      setAllTraffic(trafficData);
      setAlerts(alertData);
      setLastRefreshed(new Date().toLocaleTimeString("vi-VN"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Weather icon selector
  const getWeatherIcon = (status?: string) => {
    switch (status) {
      case "Nắng ráo":
        return <Sun className="size-10 text-amber-500 animate-spin-slow" />;
      case "Nắng nóng":
        return <Sun className="size-10 text-orange-500 animate-pulse" />;
      case "Nhiều mây":
        return <Cloud className="size-10 text-slate-400" />;
      case "Mưa rào":
        return <CloudRain className="size-10 text-blue-400" />;
      case "Mưa bão":
        return <CloudLightning className="size-10 text-purple-500" />;
      case "Có sương mù":
        return <CloudFog className="size-10 text-zinc-400" />;
      default:
        return <CloudSun className="size-10 text-slate-400" />;
    }
  };

  // Congestion colors
  const getCongestionStyles = (level?: string) => {
    switch (level) {
      case "Thông thoáng":
        return {
          badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
          indicator: "bg-emerald-500",
        };
      case "Chậm":
        return {
          badge: "bg-amber-500/10 text-amber-700 border-amber-500/20",
          indicator: "bg-amber-500",
        };
      case "Ùn tắc":
        return {
          badge: "bg-rose-500/10 text-rose-700 border-rose-500/20",
          indicator: "bg-rose-500",
        };
      case "Cấm đường":
        return {
          badge: "bg-purple-500/10 text-purple-700 border-purple-500/20",
          indicator: "bg-purple-500",
        };
      default:
        return {
          badge: "bg-slate-500/10 text-slate-700 border-slate-500/20",
          indicator: "bg-slate-500",
        };
    }
  };

  // Province-based filtering logic
  const filteredWeather = allWeather.filter((w) => {
    if (!selectedProvince) return true;
    if (w.province) return w.province === selectedProvince;
    // For specific destinations, we map manually
    if (selectedProvince === "Quảng Trị") {
      return w.destination_id?.includes("thanhco") || w.destination_id?.includes("vinhmoc");
    }
    if (selectedProvince === "Huế") {
      return w.destination_id?.includes("dainoi") || w.destination_id?.includes("tuduc");
    }
    if (selectedProvince === "Đà Nẵng") {
      return (
        w.destination_id?.includes("nguhanhson") ||
        w.destination_id?.includes("sontra") ||
        w.destination_id?.includes("banahills")
      );
    }
    return true;
  });

  const filteredTraffic = allTraffic.filter((t) => {
    if (!selectedProvince) return true;
    // Map routes to provinces
    if (selectedProvince === "Quảng Trị") {
      return t.route_name?.includes("Đông Hà") || t.destination_id?.includes("thanh-co");
    }
    if (selectedProvince === "Huế") {
      return t.destination_id?.includes("dai-noi");
    }
    if (selectedProvince === "Đà Nẵng") {
      return (
        t.route_name?.includes("Cầu Rồng") ||
        t.destination_id?.includes("ba-na-hills")
      );
    }
    if (selectedProvince === "Đà Nẵng" || selectedProvince === "Huế") {
      // Đèo Hải Vân is shared
      return t.route_name?.includes("Hải Vân");
    }
    return true;
  });

  return (
    <UserLayout>
      <main className="min-h-screen bg-brand-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-brand-primary tracking-tight">
                Thời Tiết & Giao Thông Miền Trung
              </h1>
              <p className="mt-2 text-slate-600 max-w-2xl text-sm">
                Theo dõi sát sao điều kiện thời tiết thực tế và lưu lượng giao thông trên các trục đường huyết mạch liên tỉnh Quảng Trị, Huế và Đà Nẵng.
              </p>
            </div>

            {/* Refresh / Filter control bar */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={loadData}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-slate-600 hover:text-brand-primary transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                title="Làm mới dữ liệu"
              >
                <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
                {lastRefreshed ? `Cập nhật lúc ${lastRefreshed}` : "Làm mới"}
              </button>
            </div>
          </div>

          {/* Urgent Alerts Board */}
          {!loading && alerts.length > 0 && (
            <div className="mb-8 space-y-3">
              {alerts.map((alert) => {
                const isDanger = alert.level === "Cấm đường";
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                      isDanger
                        ? "bg-rose-50 border-rose-200 text-rose-800 shadow-sm"
                        : "bg-amber-50 border-amber-200 text-amber-800 shadow-sm"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full shrink-0 ${
                        isDanger ? "bg-rose-100" : "bg-amber-100"
                      }`}
                    >
                      {isDanger ? (
                        <ShieldAlert className="size-5 text-rose-600 animate-bounce" />
                      ) : (
                        <AlertTriangle className="size-5 text-amber-600 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                            isDanger ? "bg-rose-600 text-white" : "bg-amber-600 text-white"
                          }`}
                        >
                          {alert.level.toUpperCase()}
                        </span>
                        <h4 className="text-sm font-bold">{alert.title}</h4>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed opacity-90">{alert.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Province Filter selector */}
          <div className="bg-brand-surface-lowest border border-brand-outline-variant/30 rounded-2xl p-5 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-brand-primary" />
              <span className="text-xs font-bold text-slate-700">Lọc theo phạm vi khu vực:</span>
            </div>
            <div className="w-full sm:w-64">
              <Select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                options={[
                  { label: "Tất cả địa bàn", value: "" },
                  { label: "Tỉnh Quảng Trị", value: "Quảng Trị" },
                  { label: "Tỉnh Thừa Thiên Huế", value: "Huế" },
                  { label: "Thành phố Đà Nẵng", value: "Đà Nẵng" },
                ]}
                className="focus:border-brand-primary"
              />
            </div>
          </div>

          {loading ? (
            /* Loading Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
              <div className="space-y-6">
                <div className="h-6 w-32 bg-slate-200 rounded" />
                <div className="h-44 bg-slate-200 rounded-3xl" />
                <div className="h-44 bg-slate-200 rounded-3xl" />
              </div>
              <div className="space-y-6">
                <div className="h-6 w-32 bg-slate-200 rounded" />
                <div className="h-32 bg-slate-200 rounded-3xl" />
                <div className="h-32 bg-slate-200 rounded-3xl" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Weather Column */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-brand-primary border-b border-brand-outline-variant/20 pb-2 flex items-center gap-2">
                  <Sun className="size-5 text-brand-primary/80" /> Báo cáo thời tiết khu vực
                </h2>

                {filteredWeather.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl text-slate-400 text-xs">
                    Không có thông tin thời tiết phù hợp với khu vực này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredWeather.map((w) => {
                      const isRegional = !!w.province;
                      return (
                        <div
                          key={w.weather_id}
                          className={`bg-brand-surface-lowest rounded-brand-card p-5 border border-brand-outline-variant/30 shadow-sm flex flex-col justify-between min-h-[170px] hover:shadow-md hover:border-brand-primary/20 transition-all ${
                            isRegional ? "ring-1 ring-brand-secondary/20" : ""
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                                {isRegional ? "Khu vực tỉnh" : "Điểm du lịch"}
                              </span>
                              {isRegional && (
                                <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-brand-secondary/15 text-brand-secondary">
                                  Hành chính
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 mt-1">
                              {w.province || w.destination_id?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between my-2">
                            <span className="text-3xl font-extrabold text-slate-800 tracking-tighter">
                              {w.temperature}°C
                            </span>
                            {getWeatherIcon(w.weather_status)}
                          </div>

                          <div className="border-t border-slate-100 pt-3 flex flex-col space-y-1">
                            <span className="text-xs font-bold text-brand-secondary">
                              {w.weather_status}
                            </span>
                            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-1">
                                <Droplets className="size-3" /> {w.humidity}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Wind className="size-3" /> {w.wind_speed} km/h
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Traffic Column */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-brand-primary border-b border-brand-outline-variant/20 pb-2 flex items-center gap-2">
                  <Car className="size-5 text-brand-primary/80" /> Bản tin giao thông hành trình
                </h2>

                {filteredTraffic.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl text-slate-400 text-xs">
                    Không có báo cáo giao thông phù hợp với khu vực này.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTraffic.map((t) => {
                      const styles = getCongestionStyles(t.congestion_level);
                      const title = t.route_name || t.destination_id?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                      return (
                        <div
                          key={t.traffic_id}
                          className="bg-brand-surface-lowest rounded-brand-card p-5 border border-brand-outline-variant/30 shadow-sm hover:shadow-md transition-all space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pr-4">
                              <span className={`size-2 shrink-0 rounded-full ${styles.indicator}`} />
                              {title}
                            </h3>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${styles.badge}`}>
                              {t.congestion_level}
                            </span>
                          </div>

                          <div className="flex gap-1.5 items-start text-xs font-semibold text-slate-700">
                            <Clock className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <span>{t.status}</span>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                            {t.description}
                          </p>

                          <div className="text-[9px] text-slate-400 font-medium text-right">
                            Ghi nhận: {new Date(t.observed_at).toLocaleTimeString("vi-VN")} - {new Date(t.observed_at).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </UserLayout>
  );
}

