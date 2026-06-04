"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, Filter, RefreshCw, Sun } from "lucide-react";
import { Select } from "@/components/common/Select";
import { TrafficAlertList } from "@/components/weather-traffic/TrafficAlertList";
import { TrafficCard } from "@/components/weather-traffic/TrafficCard";
import { WeatherCard } from "@/components/weather-traffic/WeatherCard";
import { getAllTraffic, getAllWeather, getTrafficAlerts } from "@/lib/api/weather-traffic";
import type { TrafficAlert, TrafficInfo, WeatherInfo } from "@/lib/types/weather-traffic";

const provinceOptions = [
  { label: "Tất cả địa bàn", value: "" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Thừa Thiên Huế", value: "Thừa Thiên Huế" },
];

type WeatherTrafficDashboardProps = {
  initialProvince?: string;
};

export function WeatherTrafficDashboard({ initialProvince = "" }: WeatherTrafficDashboardProps) {
  const [allWeather, setAllWeather] = useState<WeatherInfo[]>([]);
  const [allTraffic, setAllTraffic] = useState<TrafficInfo[]>([]);
  const [alerts, setAlerts] = useState<TrafficAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [lastRefreshed, setLastRefreshed] = useState("");

  async function loadData() {
    setLoading(true);
    setError(null);
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
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải dữ liệu thời tiết và giao thông.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSelectedProvince(initialProvince);
  }, [initialProvince]);

  useEffect(() => {
    loadData();
  }, []);

  const filteredWeather = useMemo(
    () =>
      selectedProvince
        ? allWeather.filter((weather) => weather.province === selectedProvince)
        : allWeather,
    [allWeather, selectedProvince],
  );

  const filteredTraffic = useMemo(
    () =>
      selectedProvince
        ? allTraffic.filter((traffic) => traffic.province === selectedProvince)
        : allTraffic,
    [allTraffic, selectedProvince],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-700">
            Dữ liệu demo PostGIS
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Thời tiết và giao thông du lịch
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Theo dõi điều kiện thời tiết và giao thông mock theo từng địa điểm
            trong các cụm Hồ Chí Minh, Hà Nội, Đà Nẵng và Thừa Thiên Huế.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          {lastRefreshed ? `Cập nhật lúc ${lastRefreshed}` : "Làm mới"}
        </button>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading ? <TrafficAlertList alerts={alerts} /> : null}

      <section className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-emerald-700" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-700">
            Lọc theo phạm vi khu vực
          </span>
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={selectedProvince}
            onChange={(event) => setSelectedProvince(event.target.value)}
            options={provinceOptions}
          />
        </div>
      </section>

      {loading ? (
        <LoadingGrid />
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <section className="space-y-5">
            <h2 className="flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-950">
              <Sun className="size-5 text-amber-500" aria-hidden="true" />
              Báo cáo thời tiết
            </h2>
            {filteredWeather.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredWeather.map((weather) => (
                  <WeatherCard key={weather.weather_id} weather={weather} />
                ))}
              </div>
            ) : (
              <EmptyState text="Không có thông tin thời tiết phù hợp với khu vực này." />
            )}
          </section>

          <section className="space-y-5">
            <h2 className="flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-950">
              <Car className="size-5 text-blue-700" aria-hidden="true" />
              Bản tin giao thông
            </h2>
            {filteredTraffic.length ? (
              <div className="space-y-4">
                {filteredTraffic.map((traffic) => (
                  <TrafficCard key={traffic.traffic_id} traffic={traffic} />
                ))}
              </div>
            ) : (
              <EmptyState text="Không có báo cáo giao thông phù hợp với khu vực này." />
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
        <div className="h-44 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-44 animate-pulse rounded-lg bg-slate-200" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
        <div className="h-36 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-36 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
