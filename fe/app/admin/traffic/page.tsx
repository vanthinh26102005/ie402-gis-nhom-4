"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Car, Edit3, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import {
  createAdminTrafficObservation,
  deleteAdminTrafficObservation,
  getAdminDestinations,
  getAdminTrafficObservations,
  getAdminTrafficStats,
  updateAdminTrafficObservation,
  type AdminDestination,
  type AdminListMeta,
  type AdminTrafficObservation,
  type AdminTrafficObservationPayload,
  type AdminTrafficStats,
} from "@/lib/api/admin";

type TrafficFormValues = {
  congestionLevel: string;
  description: string;
  destinationId: string;
  latitude: string;
  longitude: string;
  observedAt: string;
  status: string;
};

const defaultMeta: AdminListMeta = {
  limit: 10,
  numberMatched: 0,
  numberReturned: 0,
  page: 1,
  total: 0,
};

const defaultStats: AdminTrafficStats = {
  avgCongestionLevel: null,
  byDay: [],
  byLevel: [],
  byProvince: [],
  highRiskCount: 0,
  latestObservedAt: null,
  total: 0,
};

function nowForInput() {
  return new Date().toISOString().slice(0, 16);
}

function toInputDate(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

function toTrafficFormValues(item?: AdminTrafficObservation): TrafficFormValues {
  return {
    congestionLevel: item?.congestion_level?.toString() || "0",
    description: item?.description || "",
    destinationId: item?.destination_id || "",
    latitude: item?.location?.latitude?.toString() || "",
    longitude: item?.location?.longitude?.toString() || "",
    observedAt: item?.observed_at ? toInputDate(item.observed_at) : nowForInput(),
    status: item?.status || "",
  };
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString("vi-VN") : "Chưa có";
}

function congestionLabel(level: number) {
  if (level <= 1) return "Thông thoáng";
  if (level === 2) return "Chậm";
  if (level >= 5) return "Cấm đường";
  return "Ùn tắc";
}

function congestionTone(level: number): "default" | "error" | "info" | "success" | "warning" {
  if (level <= 1) return "success";
  if (level === 2) return "warning";
  if (level >= 5) return "error";
  return "warning";
}

export default function AdminTrafficPage() {
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [editingItem, setEditingItem] = useState<AdminTrafficObservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ from: "", q: "", to: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [meta, setMeta] = useState(defaultMeta);
  const [observations, setObservations] = useState<AdminTrafficObservation[]>([]);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState(defaultStats);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<TrafficFormValues>({
    defaultValues: toTrafficFormValues(),
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
      const [destinationItems, trafficResult, trafficStats] = await Promise.all([
        getAdminDestinations(),
        getAdminTrafficObservations(query),
        getAdminTrafficStats(query),
      ]);

      setDestinations(destinationItems);
      setObservations(trafficResult.items);
      setMeta(trafficResult.meta);
      setStats(trafficStats);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu giao thông.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const columns = useMemo<Column<AdminTrafficObservation>[]>(
    () => [
      {
        key: "destination",
        header: "Khu vực",
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
        key: "level",
        header: "Mức độ",
        render: (row) => (
          <StatusBadge status={congestionTone(row.congestion_level)} label={`${row.congestion_level}/5 · ${congestionLabel(row.congestion_level)}`} />
        ),
      },
      {
        key: "status",
        header: "Tình trạng",
        render: (row) => (
          <div>
            <span className="font-semibold text-brand-secondary">{row.status}</span>
            <p className="mt-1 line-clamp-2 text-xs text-[#6a6a6a]">
              {row.description || "Chưa có mô tả"}
            </p>
          </div>
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
    reset(toTrafficFormValues());
  }

  function startEdit(item: AdminTrafficObservation) {
    setEditingItem(item);
    reset(toTrafficFormValues(item));
  }

  async function handleDelete(item: AdminTrafficObservation) {
    if (!window.confirm("Xóa bản ghi giao thông này?")) return;
    await deleteAdminTrafficObservation(item.traffic_id);
    await loadData(page);
  }

  async function onSubmit(values: TrafficFormValues) {
    const payload: AdminTrafficObservationPayload = {
      congestionLevel: Number(values.congestionLevel),
      description: values.description.trim() || null,
      destinationId: values.destinationId || null,
      location: {
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
      },
      observedAt: new Date(values.observedAt).toISOString(),
      status: values.status.trim(),
    };

    try {
      setIsSaving(true);
      setError(null);
      if (editingItem) {
        await updateAdminTrafficObservation(editingItem.traffic_id, payload);
      } else {
        await createAdminTrafficObservation(payload);
      }
      startCreate();
      await loadData(page);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu dữ liệu giao thông.");
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
            Quản trị dữ liệu giao thông
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6a6a6a]">
            Theo dõi tình trạng giao thông theo thời gian để bản đồ 2D và route planner có cảnh báo sát thực tế.
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
        <MetricCard label="Mức ùn tắc TB" value={stats.avgCongestionLevel ?? "-"} helper="Thang 0-5" />
        <MetricCard label="Rủi ro cao" value={stats.highRiskCount} helper="Mức 3 trở lên" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="bg-white">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-brand-secondary">
                {editingItem ? "Chỉnh sửa quan trắc" : "Thêm quan trắc"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#6a6a6a]">
                Mức ùn tắc dạng số giúp dashboard và route-risk tính toán nhất quán.
              </p>
            </div>
            <Car className="size-5 text-brand-primary" aria-hidden="true" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Điểm du lịch / khu vực" error={errors.destinationId?.message}>
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

            <div className="grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)]">
              <Field label="Mức ùn tắc" error={errors.congestionLevel?.message}>
                <Select
                  {...register("congestionLevel", {
                    required: "Mức ùn tắc là bắt buộc.",
                    min: { value: 0, message: "Tối thiểu 0." },
                    max: { value: 5, message: "Tối đa 5." },
                  })}
                >
                  <option value="0">0 - Trống</option>
                  <option value="1">1 - Thông thoáng</option>
                  <option value="2">2 - Chậm</option>
                  <option value="3">3 - Ùn tắc</option>
                  <option value="4">4 - Nặng</option>
                  <option value="5">5 - Cấm đường</option>
                </Select>
              </Field>
              <Field label="Tình trạng" error={errors.status?.message}>
                <Input
                  placeholder="Thông thoáng, ùn tắc cục bộ, cấm đường..."
                  {...register("status", { required: "Tình trạng là bắt buộc." })}
                />
              </Field>
            </div>

            <Field label="Mô tả" error={errors.description?.message}>
              <Textarea
                placeholder="Mô tả nguyên nhân, khung giờ ảnh hưởng hoặc hướng đi thay thế."
                {...register("description")}
              />
            </Field>

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
                  placeholder="Tìm điểm, tỉnh, tình trạng"
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
            keyExtractor={(row) => row.traffic_id}
            loading={isLoading}
            emptyMessage="Chưa có quan trắc giao thông phù hợp bộ lọc."
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
