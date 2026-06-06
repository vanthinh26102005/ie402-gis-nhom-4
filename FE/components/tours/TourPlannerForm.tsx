"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, MapPinned, Plus, Save, Sparkles } from "lucide-react";
import { AuthStatusMessage } from "@/components/auth/AuthStatusMessage";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { ItineraryTimeline } from "@/components/tours/ItineraryTimeline";
import { PlannerInsights } from "@/components/tours/PlannerInsights";
import { createTour } from "@/lib/api/tours";
import { useDestinations } from "@/lib/hooks/useDestinations";
import { buildPlannerInsights, buildScheduledStops } from "@/lib/tours/planner";
import type { TourLegInput, TourPace, TourStatus, TourStopInput } from "@/lib/types/tour";

export type TourPlannerFormValues = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  partySize: number;
  budget: number | null;
  travelMode: "car" | "motorbike" | "walk_transit";
  pace: TourPace;
  status: TourStatus;
  stops: TourStopInput[];
  routeDistanceMeters: number | null;
  routeDurationSeconds: number | null;
  routeGeometry: unknown;
};

type RouteDraft = {
  title?: string;
  description?: string;
  destinationIds?: string[];
  distanceMeters?: number | null;
  durationSeconds?: number | null;
  travelMode?: TourPlannerFormValues["travelMode"];
  routeGeometry?: unknown;
};

export function TourPlannerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { destinations, error: destinationsError, isLoading } = useDestinations();
  const [pickerValue, setPickerValue] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<TourPlannerFormValues>({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      partySize: 1,
      budget: null,
      travelMode: "car",
      pace: "balanced",
      status: "draft",
      stops: [],
      routeDistanceMeters: null,
      routeDurationSeconds: null,
      routeGeometry: null,
    },
    mode: "onBlur",
  });
  const { fields, move, remove, replace } = useFieldArray({ control, name: "stops" });
  const watchedStops = useWatch({ control, name: "stops" });
  const stops = useMemo(() => watchedStops || [], [watchedStops]);
  const watchedPartySize = useWatch({ control, name: "partySize" });
  const watchedBudget = useWatch({ control, name: "budget" });
  const watchedPace = useWatch({ control, name: "pace" });
  const partySize = watchedPartySize || 1;
  const budget = Number.isFinite(watchedBudget) ? watchedBudget ?? null : null;
  const selectedIds = useMemo(() => new Set(stops.map((stop) => stop.destinationId)), [stops]);
  const insights = useMemo(
    () => buildPlannerInsights({ stops, destinations, budget, partySize }),
    [budget, destinations, partySize, stops],
  );
  const suggestedDestinations = useMemo(() => {
    const selected = stops.map((stop) => destinations.find((item) => item.id === stop.destinationId)).filter(Boolean);
    const provinces = new Set(selected.map((item) => item?.province.code));
    return destinations
      .filter((destination) => !selectedIds.has(destination.id))
      .sort((left, right) => {
        const leftNearby = provinces.has(left.province.code) ? 1 : 0;
        const rightNearby = provinces.has(right.province.code) ? 1 : 0;
        return rightNearby - leftNearby || (right.rating ?? 0) - (left.rating ?? 0);
      })
      .slice(0, 3);
  }, [destinations, selectedIds, stops]);

  useEffect(() => {
    if (destinations.length === 0 || searchParams.get("fromRoute") !== "1") return;
    const validIds = new Set(destinations.map((destination) => destination.id));
    let draft: RouteDraft = {};
    try {
      draft = JSON.parse(window.localStorage.getItem("gis-tour-route-draft") || "{}") as RouteDraft;
    } catch {
      draft = {};
    }
    const routeIds = (draft.destinationIds || [
      searchParams.get("startId"),
      searchParams.get("endId"),
    ]).filter((id): id is string => Boolean(id && validIds.has(id)));
    const pace: TourPace = "balanced";
    const scheduledStops = buildScheduledStops([...new Set(routeIds)], destinations, pace);
    reset({
      title: draft.title || "Kế hoạch du lịch mới",
      description: draft.description || "",
      startDate: "",
      endDate: "",
      partySize: 1,
      budget: null,
      travelMode: draft.travelMode || "car",
      pace,
      status: "draft",
      stops: scheduledStops,
      routeDistanceMeters: draft.distanceMeters ?? null,
      routeDurationSeconds: draft.durationSeconds ?? null,
      routeGeometry: draft.routeGeometry ?? null,
    });
  }, [destinations, reset, searchParams]);

  function addDestination(destinationId: string) {
    if (!destinationId || selectedIds.has(destinationId)) return;
    const next = buildScheduledStops(
      [...stops.map((stop) => stop.destinationId), destinationId],
      destinations,
      watchedPace || "balanced",
    );
    replace(next);
    setPickerValue("");
  }

  async function onSubmit(values: TourPlannerFormValues) {
    setStatusMessage(null);
    const distanceKm = values.routeDistanceMeters ? values.routeDistanceMeters / 1000 : null;
    const durationMinutes = values.routeDurationSeconds ? Math.round(values.routeDurationSeconds / 60) : null;
    const legs: TourLegInput[] = values.stops.slice(0, -1).map((stop, index) => ({
      fromDestinationId: stop.destinationId,
      toDestinationId: values.stops[index + 1].destinationId,
      travelMode: values.travelMode,
      distanceKm: values.stops.length === 2 ? distanceKm : null,
      durationMinutes: values.stops.length === 2 ? durationMinutes : null,
      routeGeometry: values.stops.length === 2 ? values.routeGeometry : null,
    }));
    const result = await createTour({
      title: values.title,
      description: values.description,
      stops: values.stops,
      status: values.status,
      startDate: values.startDate || null,
      endDate: values.endDate || values.startDate || null,
      partySize: values.partySize,
      budget: values.budget || null,
      travelMode: values.travelMode,
      pace: values.pace,
      totalDistanceKm: distanceKm,
      estimatedDurationMinutes: durationMinutes,
      legs,
    });
    if (!result.ok || !result.data) {
      setStatusMessage(result.message);
      return;
    }
    window.localStorage.removeItem("gis-tour-route-draft");
    router.push(`/tours/${result.data.id}?created=1`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        {statusMessage ? <AuthStatusMessage variant="error" message={statusMessage} /> : null}
        {destinationsError ? <AuthStatusMessage variant="error" message={destinationsError} /> : null}

        <section className="rounded-lg border border-brand-outline-variant bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-brand-surface-low text-brand-secondary">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-brand-secondary">Thông tin chuyến đi</h2>
              <p className="text-sm text-[#6a6a6a]">Đặt khung thời gian và giới hạn để kế hoạch sát thực tế.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-brand-secondary md:col-span-2">
              Tên kế hoạch
              <Input
                className="mt-2"
                placeholder="Ví dụ: Huế và Hội An cuối tuần"
                {...register("title", {
                  required: "Vui lòng nhập tên kế hoạch.",
                  minLength: { value: 3, message: "Tên cần ít nhất 3 ký tự." },
                })}
              />
              {errors.title ? <span className="mt-1 block text-sm text-brand-danger">{errors.title.message}</span> : null}
            </label>
            <label className="text-sm font-medium text-brand-secondary">
              Ngày bắt đầu
              <Input className="mt-2" type="date" {...register("startDate")} />
            </label>
            <label className="text-sm font-medium text-brand-secondary">
              Ngày kết thúc
              <Input
                className="mt-2"
                type="date"
                {...register("endDate", {
                  validate: (value, form) => !value || !form.startDate || value >= form.startDate || "Ngày kết thúc phải sau ngày bắt đầu.",
                })}
              />
              {errors.endDate ? <span className="mt-1 block text-sm text-brand-danger">{errors.endDate.message}</span> : null}
            </label>
            <label className="text-sm font-medium text-brand-secondary">
              Số người
              <Input
                className="mt-2"
                type="number"
                min={1}
                max={100}
                {...register("partySize", { valueAsNumber: true, min: 1, max: 100 })}
              />
            </label>
            <label className="text-sm font-medium text-brand-secondary">
              Ngân sách dự kiến
              <Input
                className="mt-2"
                type="number"
                min={0}
                step={50000}
                placeholder="Không bắt buộc"
                {...register("budget", { setValueAs: (value) => value === "" ? null : Number(value) })}
              />
            </label>
            <label className="text-sm font-medium text-brand-secondary">
              Phương tiện
              <Select
                className="mt-2"
                options={[
                  { label: "Ô tô", value: "car" },
                  { label: "Xe máy", value: "motorbike" },
                  { label: "Đi bộ + transit", value: "walk_transit" },
                ]}
                {...register("travelMode")}
              />
            </label>
            <label className="text-sm font-medium text-brand-secondary">
              Nhịp chuyến đi
              <Select
                className="mt-2"
                options={[
                  { label: "Gọn, ưu tiên nhiều điểm", value: "compact" },
                  { label: "Cân bằng", value: "balanced" },
                  { label: "Chậm rãi", value: "relaxed" },
                ]}
                {...register("pace")}
              />
            </label>
            <label className="text-sm font-medium text-brand-secondary md:col-span-2">
              Ghi chú chung
              <Textarea
                className="mt-2"
                placeholder="Mục tiêu chuyến đi, nhu cầu trẻ nhỏ, người lớn tuổi hoặc lưu ý đặc biệt..."
                {...register("description", { maxLength: 1000 })}
              />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-brand-outline-variant bg-brand-surface-low p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-secondary">
                <MapPinned className="size-5" aria-hidden="true" />
                Lịch trình theo điểm
              </h2>
              <p className="mt-1 text-sm text-[#6a6a6a]">Sắp xếp thứ tự và chỉnh giờ cho từng hoạt động.</p>
            </div>
            <div className="flex min-w-0 gap-2">
              <Select
                value={pickerValue}
                onChange={(event) => setPickerValue(event.target.value)}
                disabled={isLoading}
                options={[
                  { label: isLoading ? "Đang tải..." : "Thêm điểm đến...", value: "" },
                  ...destinations
                    .filter((destination) => !selectedIds.has(destination.id))
                    .map((destination) => ({ label: destination.name, value: destination.id })),
                ]}
              />
              <Button type="button" variant="outline" size="icon" disabled={!pickerValue} onClick={() => addDestination(pickerValue)} aria-label="Thêm điểm đến">
                <Plus className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="mt-5">
            {fields.length > 0 ? (
              <ItineraryTimeline destinations={destinations} stops={stops} register={register} onMove={move} onRemove={remove} />
            ) : (
              <div className="rounded-lg border border-dashed border-brand-outline-variant bg-white px-5 py-10 text-center">
                <MapPinned className="mx-auto size-7 text-[#6a6a6a]" aria-hidden="true" />
                <p className="mt-3 font-medium text-brand-secondary">Chưa có điểm nào trong kế hoạch</p>
                <p className="mt-1 text-sm text-[#6a6a6a]">Chọn điểm đến phía trên hoặc bắt đầu từ trang Chỉ đường.</p>
              </div>
            )}
          </div>
          {fields.length === 1 ? (
            <p className="mt-3 text-sm text-brand-danger">Cần ít nhất hai điểm để tạo kế hoạch.</p>
          ) : null}
        </section>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-lg border border-brand-outline-variant bg-white p-5 shadow-[var(--shadow-brand-map)]">
          <PlannerInsights insights={insights} />
        </div>
        {suggestedDestinations.length > 0 ? (
          <section className="rounded-lg border border-brand-outline-variant bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-secondary">
              <Sparkles className="size-5" aria-hidden="true" />
              Điểm có thể ghé thêm
            </h2>
            <div className="mt-4 grid gap-3">
              {suggestedDestinations.map((destination) => (
                <button
                  key={destination.id}
                  type="button"
                  onClick={() => addDestination(destination.id)}
                  className="rounded-lg border border-brand-outline-variant p-3 text-left transition-colors hover:border-brand-secondary hover:bg-brand-surface-low"
                >
                  <span className="block font-medium text-brand-secondary">{destination.name}</span>
                  <span className="mt-1 block text-xs text-[#6a6a6a]">
                    {destination.province.name} · {destination.rating?.toFixed(1) || "Mới"} điểm
                  </span>
                  <span className="mt-2 block text-xs font-medium text-brand-primary">Phù hợp khu vực đang chọn</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}
        <div className="rounded-lg border border-brand-outline-variant bg-white p-4">
          <label className="text-sm font-medium text-brand-secondary">
            Trạng thái khi lưu
            <Select
              className="mt-2"
              options={[
                { label: "Lưu nháp", value: "draft" },
                { label: "Kế hoạch đã sẵn sàng", value: "planned" },
              ]}
              {...register("status")}
            />
          </label>
          <Button type="submit" className="mt-4 w-full" disabled={isSubmitting || isLoading || fields.length < 2}>
            <Save className="size-4" aria-hidden="true" />
            {isSubmitting ? "Đang lưu kế hoạch..." : "Lưu kế hoạch"}
          </Button>
        </div>
      </aside>
    </form>
  );
}
