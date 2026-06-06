"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, MapPinned, Plus, Route } from "lucide-react";
import { Button } from "@/components/common/Button";
import { fetchTours } from "@/lib/api/tours";
import type { CreatedTour, TourStatus } from "@/lib/types/tour";

const STATUS_LABELS: Record<TourStatus, string> = {
  draft: "Bản nháp",
  planned: "Đã sẵn sàng",
  active: "Đang đi",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

export function TourList() {
  const [tours, setTours] = useState<CreatedTour[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTours()
      .then(setTours)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải kế hoạch."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p className="rounded-lg bg-brand-surface-low p-6 text-sm text-[#6a6a6a]">Đang tải kế hoạch của bạn...</p>;
  }
  if (error) {
    return (
      <div className="rounded-lg border border-brand-danger/25 bg-white p-6">
        <p className="text-brand-danger">{error}</p>
        <Button asChild className="mt-4"><Link href="/auth/login">Đăng nhập</Link></Button>
      </div>
    );
  }
  if (tours.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-brand-outline-variant bg-white px-6 py-14 text-center">
        <MapPinned className="mx-auto size-8 text-[#6a6a6a]" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-brand-secondary">Bạn chưa có kế hoạch nào</h2>
        <p className="mt-2 text-sm text-[#6a6a6a]">Bắt đầu từ một tuyến đường hoặc tự chọn các điểm muốn ghé.</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button asChild variant="outline"><Link href="/route"><Route className="size-4" />Chỉ đường</Link></Button>
          <Button asChild><Link href="/tours/create"><Plus className="size-4" />Tạo kế hoạch</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tours.map((tour) => (
        <Link
          key={tour.id}
          href={`/tours/${tour.id}`}
          className="group flex min-h-64 flex-col justify-between rounded-lg border border-brand-outline-variant bg-white p-5 transition-[border-color,box-shadow] hover:border-brand-secondary hover:shadow-[var(--shadow-brand-map)]"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-brand-surface-low px-3 py-1 text-xs font-semibold text-brand-secondary">
                {STATUS_LABELS[tour.status]}
              </span>
              <span className="text-sm font-medium text-[#6a6a6a]">{tour.destinations.length} điểm</span>
            </div>
            <h2 className="mt-4 line-clamp-2 text-xl font-semibold leading-7 text-brand-secondary">{tour.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6a6a6a]">
              {tour.description || "Kế hoạch du lịch cá nhân"}
            </p>
          </div>
          <div className="mt-6 grid gap-2 text-sm text-[#3f3f3f]">
            <span className="flex items-center gap-2"><CalendarDays className="size-4" />{tour.startDate || "Chưa chọn ngày"}</span>
            <span className="flex items-center gap-2"><Clock3 className="size-4" />{tour.estimatedDurationMinutes ? `${tour.estimatedDurationMinutes} phút di chuyển` : "Thời gian linh hoạt"}</span>
            <span className="mt-2 font-medium text-brand-primary group-hover:underline">Mở kế hoạch</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
