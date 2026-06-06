"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { CloudSun, Edit3, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import {
  createAdminWeatherObservation,
  deleteAdminWeatherObservation,
  getAdminDestinations,
  getAdminWeatherObservations,
  getAdminWeatherStats,
  updateAdminWeatherObservation,
  type AdminDestination,
  type AdminListMeta,
  type AdminWeatherObservation,
  type AdminWeatherObservationPayload,
  type AdminWeatherStats,
} from "@/lib/api/admin";

type WeatherFormValues = {
  destinationId: string;
  humidity: string;
  latitude: string;
  longitude: string;
  observedAt: string;
  temperature: string;
  weatherStatus: string;
  windSpeed: string;
};

const defaultMeta: AdminListMeta = {
  limit: 10,
  numberMatched: 0,
  numberReturned: 0,
  page: 1,
  total: 0,
};

const defaultStats: AdminWeatherStats = {
  avgHumidity: null,
  avgTemperature: null,
  byDay: [],
  byProvince: [],
  byStatus: [],
  latestObservedAt: null,
  total: 0,
};

function nowForInput() {
  return new Date().toISOString().slice(0, 16);
}

function toInputDate(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

function toNumberOrNull(value: string) {
  if (value.trim() === "") return null;
  return Number(value);
}

function toWeatherFormValues(item?: AdminWeatherObservation): WeatherFormValues {
  return {
    destinationId: item?.destination_id || "",
    humidity: item?.humidity?.toString() || "",
    latitude: item?.location?.latitude?.toString() || "",
    longitude: item?.location?.longitude?.toString() || "",
    observedAt: item?.observed_at ? toInputDate(item.observed_at) : nowForInput(),
    temperature: item?.temperature?.toString() || "",
    weatherStatus: item?.weather_status || "",
    windSpeed: item?.wind_speed?.toString() || "",
  };
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString("vi-VN") : "Chưa có";
}

export default function AdminWeatherPage() {
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [editingItem, setEditingItem] = useState<AdminWeatherObservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ from: "", q: "", to: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [meta, setMeta] = useState(defaultMeta);
  const [observations, setObservations] = useState<AdminWeatherObservation[]>([]);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState(defaultStats);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<WeatherFormValues>({
    defaultValues: toWeatherFormValues(),
  });

  const selectedDestinationId = watch("destinationId");

  useEffect(() => {
    const destination = destinations.find((item) => item.id === selectedDestinationId);
    if (!destination?.location || editingItem) return;
    setValue("latitude", String(destination.location.lat));
    setValue("longitude", String(destination.location.lng));
  }, [destinations, editingItem, selectedDestinationId, setValue]);

  async function loadData(nextPage = page) {
    try {
      setIsLoading(true);
      setError(null);
      const query = {
        from: filters.from || undefined,
        limit: 10,
        page: nextPage,
        q: filters.q || undefined,
        to: filters.to || undefined,
      };
      const [destinationItems, weatherResult, weatherStats] = await Promise.all([
        getAdminDestinations(),
        getAdminWeatherObservations(query),
        getAdminWeatherStats(query),
      ]);

      setDestinations(destinationItems);
      setObservations(weatherResult.items);
      setMeta(weatherResult.meta);
      setStats(weatherStats);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu thời tiết.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const columns = useMemo<Column<AdminWeatherObservation>[]>(
    () => [
      {
        key: "destination",
        header: "Điểm quan trắc",
        render: (row) => (
          <div>
            <strong className="block text-brand-secondary">
              {row.destination_name || "Không gắn điểm đến"}
            </strong>
            <span className="mt-1 block text-xs text-[#6a6a6a]">
              {row.province || "Chưa có tỉnh"} · {row.location?.latitude.toFixed(4)}, {row.location?.longitude.toFixed(4)}
            </span>
          </div>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        render: (row) => <StatusBadge status="info" label={row.weather_status || "Khác"} />,
      },
      {
        key: "metrics",
        header: "Chỉ số",
        render: (row) => (
          <span className="text-sm text-[#6a6a6a]">
            {row.temperature ?? "-"}°C · {row.humidity ?? "-"}% · gió {row.wind_speed ?? "-"} km/h
          </span>
        ),
      },
      {
        key: "observed_at",
        header: "Thời gian",
        render: (row) => <span className="text-sm text-[#6a6a6a]">{formatDate(row.observed_at)}</span>,
      },
    ],
    [],
  );

  function startCreate() {
    setEditingItem(null);
    reset(toWeatherFormValues());
  }

  function startEdit(item: AdminWeatherObservation) {
    setEditingItem(item);
    reset(toWeatherFormValues(item));
  }

  async function handleDelete(item: AdminWeatherObservation) {
    if (!window.confirm("Xóa bản ghi thời tiết này?")) return;
    await deleteAdminWeatherObservation(item.weather_id);
    await loadData(page);
  }

  async function onSubmit(values: WeatherFormValues) {
    const payload: AdminWeatherObservationPayload = {
      destinationId: values.destinationId || null,
      humidity: toNumberOrNull(values.humidity),
      location: {
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
      },
      observedAt: new Date(values.observedAt).toISOString(),
      temperature: toNumberOrNull(values.temperature),
      weatherStatus: values.weatherStatus.trim(),
      windSpeed: toNumberOrNull(values.windSpeed),
    };

    try {
      setIsSaving(true);
      setError(null);
      if (editingItem) {
        await updateAdminWeatherObservation(editingItem.weather_id, payload);
      } else {
        await createAdminWeatherObservation(payload);
      }
      startCreate();
      await loadData(page);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu dữ liệu thời tiết.");
    } finally {
      setIsSaving(false);
    }
  }

  function applyFilters() {
    setPage(1);
    loadData(1);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-lg border border-brand-outline-variant bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-primary">Temporal layer</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-secondary">
            Quản trị dữ liệu thời tiết
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6a6a6a]">
            Tạo, cập nhật và kiểm soát các quan trắc thời tiết theo điểm du lịch để bản đồ 2D thay đổi đúng theo thời gian.
          </p>
        </div>
        <Button type="button" onClick={startCreate}>
          <Plus className="size-4" aria-hidden="true" />
          Bản ghi mới
        </Button>
      </header>

      {error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Tổng quan trắc" value={stats.total} helper="Bản ghi trong bộ lọc" />
        <MetricCard label="Nhiệt độ TB" value={stats.avgTemperature ?? "-"} helper="Theo khoảng thời gian" />
        <MetricCard label="Mới nhất" value={formatDate(stats.latestObservedAt).split(" ")[0]} helper={formatDate(stats.latestObservedAt)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="bg-white">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-brand-secondary">
                {editingItem ? "Chỉnh sửa quan trắc" : "Thêm quan trắc"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#6a6a6a]">
                Tọa độ dùng WGS84, longitude/latitude được lưu vào PostGIS.
              </p>
            </div>
            <CloudSun className="size-5 text-brand-primary" aria-hidden="true" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Điểm du lịch" error={errors.destinationId?.message}>
              <Select {...register("destinationId")}>
                <option value="">Không gắn điểm đến</option>
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Vĩ độ" error={errors.latitude?.message}>
                <Input
                  type="number"
                  step="0.000001"
                  {...register("latitude", {
                    required: "Vĩ độ là bắt buộc.",
                    min: { value: -90, message: "Vĩ độ tối thiểu -90." },
                    max: { value: 90, message: "Vĩ độ tối đa 90." },
                  })}
                />
              </Field>
              <Field label="Kinh độ" error={errors.longitude?.message}>
                <Input
                  type="number"
                  step="0.000001"
                  {...register("longitude", {
                    required: "Kinh độ là bắt buộc.",
                    min: { value: -180, message: "Kinh độ tối thiểu -180." },
                    max: { value: 180, message: "Kinh độ tối đa 180." },
                  })}
                />
              </Field>
            </div>

            <Field label="Thời điểm quan trắc" error={errors.observedAt?.message}>
              <Input type="datetime-local" {...register("observedAt", { required: "Thời điểm là bắt buộc." })} />
            </Field>

            <Field label="Trạng thái thời tiết" error={errors.weatherStatus?.message}>
              <Select {...register("weatherStatus", { required: "Trạng thái là bắt buộc." })}>
                <option value="">Chọn trạng thái</option>
                <option value="Nắng ráo">Nắng ráo</option>
                <option value="Nắng nóng">Nắng nóng</option>
                <option value="Nhiều mây">Nhiều mây</option>
                <option value="Mưa rào">Mưa rào</option>
                <option value="Mưa bão">Mưa bão</option>
                <option value="Có sương mù">Có sương mù</option>
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Nhiệt độ" error={errors.temperature?.message}>
                <Input type="number" step="0.1" placeholder="28.5" {...register("temperature")} />
              </Field>
              <Field label="Độ ẩm" error={errors.humidity?.message}>
                <Input
                  type="number"
                  placeholder="75"
                  {...register("humidity", {
                    min: { value: 0, message: "Tối thiểu 0%." },
                    max: { value: 100, message: "Tối đa 100%." },
                  })}
                />
              </Field>
              <Field label="Gió" error={errors.windSpeed?.message}>
                <Input type="number" step="0.1" placeholder="8" {...register("windSpeed")} />
              </Field>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <RefreshCw className="size-4 animate-spin" aria-hidden="true" /> : null}
                {editingItem ? "Lưu thay đổi" : "Tạo bản ghi"}
              </Button>
              {editingItem ? (
                <Button type="button" variant="outline" onClick={startCreate}>
                  Hủy sửa
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <section className="space-y-4">
          <Card className="bg-white p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px_auto]">
              <label className="flex min-h-11 items-center gap-2 rounded-lg border border-brand-outline-variant bg-white px-3">
                <Search className="size-4 text-[#6a6a6a]" aria-hidden="true" />
                <input
                  value={filters.q}
                  onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  placeholder="Tìm điểm, tỉnh, trạng thái"
                  type="search"
                />
              </label>
              <Input
                type="date"
                value={filters.from}
                onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))}
              />
              <Input
                type="date"
                value={filters.to}
                onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))}
              />
              <Button type="button" variant="outline" onClick={applyFilters}>
                Lọc
              </Button>
            </div>
          </Card>

          <DataTable
            data={observations}
            columns={columns}
            keyExtractor={(row) => row.weather_id}
            loading={isLoading}
            emptyMessage="Chưa có quan trắc thời tiết phù hợp bộ lọc."
            pagination={{
              page: meta.page,
              pageSize: meta.limit,
              total: meta.total,
              onPageChange: setPage,
            }}
            actions={[
              { label: "Sửa", icon: Edit3, onClick: startEdit },
              { label: "Xóa", icon: Trash2, variant: "destructive", onClick: handleDelete },
            ]}
          />
        </section>
      </section>
    </div>
  );
}

function Field({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-secondary">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-xs font-semibold text-brand-danger">{error}</span> : null}
    </label>
  );
}

function MetricCard({
  helper,
  label,
  value,
}: {
  helper: string;
  label: string;
  value: number | string;
}) {
  return (
    <article className="rounded-lg border border-brand-outline-variant bg-white p-4">
      <p className="text-xs font-bold uppercase text-[#6a6a6a]">{label}</p>
      <strong className="mt-2 block text-2xl font-bold text-brand-secondary">{value}</strong>
      <p className="mt-1 text-xs font-medium text-[#6a6a6a]">{helper}</p>
    </article>
  );
}
