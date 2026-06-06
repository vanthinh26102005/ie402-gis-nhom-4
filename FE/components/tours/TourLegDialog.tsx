"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { Clock3, MapPin, Navigation, Save, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { updateTour } from "@/lib/api/tours";
import type { CreatedTour, TourDestination, TourLeg } from "@/lib/types/tour";

const TourLegMap = dynamic(
  () => import("@/components/tours/TourLegMap").then((module) => module.TourLegMap),
  { ssr: false, loading: () => <div className="grid min-h-64 place-items-center bg-brand-surface-low text-sm text-[#6a6a6a]">Đang tải bản đồ chặng...</div> },
);

type LegFormValues = {
  title: string;
  note: string;
  departureTime: string;
  durationMinutes: number | null;
};

export function TourLegDialog({
  tour,
  leg,
  from,
  to,
  onClose,
  onSaved,
}: {
  tour: CreatedTour;
  leg: TourLeg;
  from: TourDestination;
  to: TourDestination;
  onClose: () => void;
  onSaved: (tour: CreatedTour) => void;
}) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LegFormValues>({
    defaultValues: {
      title: leg.title || `${from.name} đến ${to.name}`,
      note: leg.note || "",
      departureTime: leg.departureTime?.slice(0, 5) || from.departureTime?.slice(0, 5) || "",
      durationMinutes: leg.durationMinutes,
    },
    mode: "onBlur",
  });

  async function onSubmit(values: LegFormValues) {
    try {
      const nextLegs = tour.legs.map((item) =>
        item.id === leg.id
          ? {
              ...item,
              title: values.title.trim(),
              note: values.note.trim(),
              departureTime: values.departureTime || null,
              durationMinutes: values.durationMinutes,
            }
          : item,
      );
      onSaved(await updateTour(tour.id, { legs: nextLegs }));
      onClose();
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Không thể lưu kế hoạch chặng.",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-[1500] grid place-items-center bg-black/50 p-3 sm:p-6" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="leg-dialog-title"
        className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-brand-outline-variant px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-primary">Kế hoạch cho chặng {leg.legOrder}</p>
            <h2 id="leg-dialog-title" className="mt-1 truncate text-xl font-semibold text-brand-secondary">
              {from.name} → {to.name}
            </h2>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Đóng chi tiết chặng" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="h-[min(38vh,360px)] min-h-64 overflow-hidden border-b border-brand-outline-variant">
            <TourLegMap leg={leg} from={from} to={to} />
          </div>
          <form id="leg-plan-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-4">
              {errors.root?.message ? (
                <p className="rounded-lg border border-brand-danger/25 bg-red-50 p-3 text-sm text-brand-danger">{errors.root.message}</p>
              ) : null}
              <label className="block text-sm font-medium text-brand-secondary">
                Tên hoạt động của chặng
                <Input
                  className="mt-2"
                  placeholder="Ví dụ: Di chuyển và ăn trưa tại Lăng Cô"
                  {...register("title", {
                    required: "Vui lòng nhập tên chặng.",
                    minLength: { value: 3, message: "Tên chặng cần ít nhất 3 ký tự." },
                    maxLength: { value: 150, message: "Tên chặng tối đa 150 ký tự." },
                  })}
                />
                {errors.title ? <span className="mt-1 block text-sm text-brand-danger">{errors.title.message}</span> : null}
              </label>
              <label className="block text-sm font-medium text-brand-secondary">
                Ghi chú và lịch trình nhỏ
                <Textarea
                  className="mt-2 min-h-32"
                  placeholder="Điểm nghỉ, nơi ăn uống, việc cần chuẩn bị, đoạn đường cần chú ý..."
                  {...register("note", { maxLength: { value: 1000, message: "Ghi chú tối đa 1000 ký tự." } })}
                />
                {errors.note ? <span className="mt-1 block text-sm text-brand-danger">{errors.note.message}</span> : null}
              </label>
            </div>
            <aside className="space-y-4 rounded-lg bg-brand-surface-low p-4">
              <div className="flex gap-3 text-sm text-[#3f3f3f]">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{from.province.name} → {to.province.name}</span>
              </div>
              <div className="flex gap-3 text-sm text-[#3f3f3f]">
                <Navigation className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{leg.distanceKm ? `${leg.distanceKm.toFixed(1)} km` : "Khoảng cách chưa được tính"}</span>
              </div>
              <label className="block text-sm font-medium text-brand-secondary">
                Giờ khởi hành
                <Input type="time" className="mt-2 h-11" {...register("departureTime")} />
              </label>
              <label className="block text-sm font-medium text-brand-secondary">
                Thời gian di chuyển
                <span className="relative mt-2 block">
                  <Input
                    type="number"
                    min={0}
                    className="h-11 pr-14"
                    {...register("durationMinutes", {
                      setValueAs: (value) => value === "" ? null : Number(value),
                      min: { value: 0, message: "Thời gian không được âm." },
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-3 text-xs text-[#6a6a6a]">phút</span>
                </span>
              </label>
              <p className="flex gap-2 text-xs leading-5 text-[#6a6a6a]">
                <Clock3 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                Thêm thời gian nghỉ hoặc ăn uống vào ghi chú để lịch dễ theo dõi.
              </p>
            </aside>
          </form>
        </div>

        <footer className="flex shrink-0 justify-end gap-2 border-t border-brand-outline-variant bg-white px-5 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" form="leg-plan-form" disabled={isSubmitting}>
            <Save className="size-4" aria-hidden="true" />
            {isSubmitting ? "Đang lưu..." : "Lưu chặng"}
          </Button>
        </footer>
      </section>
    </div>
  );
}
