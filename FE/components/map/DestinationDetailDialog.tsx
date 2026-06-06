"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Dialog } from "radix-ui";
import {
  Car,
  Clock,
  CloudSun,
  ImageOff,
  MapPin,
  Navigation,
  Star,
  Ticket,
  X,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { fetchDestinationDetail } from "@/lib/api/destinations";
import { getReviewSummary } from "@/lib/api/reviews";
import { formatVnd } from "@/lib/format/currency";
import type { DestinationDetail, DestinationFeatureProperties } from "@/lib/types/destination";
import type { ReviewSummary } from "@/lib/types/review";
import { cn } from "@/lib/utils";

type DestinationDetailDialogProps = {
  destinationId: string | null;
  fallbackDestination?: DestinationFeatureProperties | null;
  onOpenChange: (open: boolean) => void;
};

type DestinationDialogLoadState = {
  destination: DestinationDetail | null;
  destinationId: string;
  error: string | null;
  reviewSummary: ReviewSummary;
};

const emptyReviewSummary: ReviewSummary = {
  averageScore: null,
  distribution: [5, 4, 3, 2, 1].map((score) => ({ count: 0, score })),
  totalReviews: 0,
};

export function DestinationDetailDialog({
  destinationId,
  fallbackDestination,
  onOpenChange,
}: DestinationDetailDialogProps) {
  const [loadState, setLoadState] = useState<DestinationDialogLoadState | null>(null);

  useEffect(() => {
    if (!destinationId) return;

    const activeDestinationId = destinationId;
    let isMounted = true;

    async function loadDestinationDetail() {
      const [detailResult, summaryResult] = await Promise.allSettled([
        fetchDestinationDetail(activeDestinationId),
        getReviewSummary(activeDestinationId),
      ]);

      if (!isMounted) return;

      setLoadState({
        destination: detailResult.status === "fulfilled" ? detailResult.value : null,
        destinationId: activeDestinationId,
        error:
          detailResult.status === "fulfilled"
            ? null
            : "Chưa tải được chi tiết địa điểm. Bạn vẫn có thể tạo lộ trình từ điểm đang chọn.",
        reviewSummary:
          summaryResult.status === "fulfilled"
            ? summaryResult.value
            : emptyReviewSummary,
      });
    }

    loadDestinationDetail();

    return () => {
      isMounted = false;
    };
  }, [destinationId]);

  const currentLoadState = loadState?.destinationId === destinationId ? loadState : null;
  const destination = currentLoadState?.destination ?? null;
  const reviewSummary = currentLoadState?.reviewSummary ?? emptyReviewSummary;
  const error = currentLoadState?.error ?? null;
  const isLoading = Boolean(destinationId && !currentLoadState);

  const viewModel = useMemo(() => {
    const rating =
      reviewSummary.averageScore ??
      destination?.rating ??
      normalizeNumber(fallbackDestination?.rating);

    return {
      address: destination?.address || fallbackDestination?.address || destination?.province.name || fallbackDestination?.provinceName || "Đang cập nhật",
      category: destination?.category?.name || fallbackDestination?.categoryName || "Địa điểm du lịch",
      closeTime: destination?.closeTime,
      description: destination?.description || fallbackDestination?.description || "Thông tin chi tiết đang được cập nhật.",
      id: destination?.id || fallbackDestination?.id || destinationId || "",
      imageUrl: destination?.imageUrl || fallbackDestination?.imageUrl || null,
      name: destination?.name || fallbackDestination?.name || "Chi tiết địa điểm",
      openTime: destination?.openTime,
      province: destination?.province.name || fallbackDestination?.provinceName || "",
      rating,
      ticketPrice: destination?.ticketPrice ?? normalizeNumber(fallbackDestination?.ticketPrice),
      totalReviews: reviewSummary.totalReviews,
      traffic: destination?.traffic ?? null,
      weather: destination?.weather ?? null,
    };
  }, [destination, destinationId, fallbackDestination, reviewSummary]);

  const openHours =
    viewModel.openTime && viewModel.closeTime
      ? `${viewModel.openTime} - ${viewModel.closeTime}`
      : "Đang cập nhật";

  return (
    <Dialog.Root open={Boolean(destinationId)} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1800] bg-slate-950/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[1810] max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/70 bg-white shadow-2xl outline-none">
          <div className="relative max-h-[92vh] overflow-auto">
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Đóng chi tiết địa điểm"
                className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white/95 text-slate-700 shadow-[var(--shadow-brand-map)] transition-colors hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/30"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>

            <div className="relative h-64 bg-slate-200 sm:h-80">
              {viewModel.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={viewModel.imageUrl}
                  alt={viewModel.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center bg-brand-surface-low text-sm font-semibold text-slate-500">
                  <ImageOff className="mb-2 size-8" aria-hidden="true" />
                  Chưa có hình ảnh
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                  {viewModel.category}
                </p>
                <Dialog.Title className="mt-2 max-w-2xl text-3xl font-black leading-tight">
                  {viewModel.name}
                </Dialog.Title>
                <Dialog.Description className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-white/90">
                  <MapPin className="size-4" aria-hidden="true" />
                  {viewModel.province || viewModel.address}
                </Dialog.Description>
              </div>
            </div>

            <div className="space-y-5 p-5">
              {error ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-4">
                <InsightTile
                  icon={Star}
                  label="Đánh giá"
                  value={viewModel.rating !== null ? viewModel.rating.toFixed(1) : "N/A"}
                  helper={viewModel.totalReviews > 0 ? `${viewModel.totalReviews} lượt` : "Chưa có dữ liệu"}
                  isLoading={isLoading}
                />
                <InsightTile
                  icon={Clock}
                  label="Giờ mở cửa"
                  value={openHours}
                  isLoading={isLoading}
                />
                <InsightTile
                  icon={Ticket}
                  label="Giá vé"
                  value={formatVnd(viewModel.ticketPrice)}
                  isLoading={isLoading}
                />
                <InsightTile
                  icon={MapPin}
                  label="Khu vực"
                  value={viewModel.province || "Đang cập nhật"}
                  isLoading={isLoading}
                />
              </div>

              <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div>
                  <h3 className="text-base font-extrabold text-slate-950">Tổng quan</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {viewModel.description}
                  </p>
                  <div className="mt-4 rounded-lg border border-brand-outline-variant bg-brand-surface-low px-3 py-2 text-sm leading-6 text-slate-700">
                    <span className="font-bold text-slate-950">Địa chỉ: </span>
                    {viewModel.address}
                  </div>
                </div>

                <div className="grid gap-3">
                  <StatusTile
                    icon={CloudSun}
                    label="Thời tiết"
                    value={
                      viewModel.weather
                        ? `${viewModel.weather.weatherStatus || "Đang cập nhật"} · ${viewModel.weather.temperature ?? "N/A"}°C`
                        : "Đang cập nhật"
                    }
                  />
                  <StatusTile
                    icon={Car}
                    label="Giao thông"
                    value={viewModel.traffic?.status || "Đang cập nhật"}
                  />
                </div>
              </section>

              <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  Xem nhanh trong bản đồ, không cần rời khỏi luồng khám phá.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href={`/route?end=${encodeURIComponent(viewModel.id)}`}>
                      <Navigation className="size-4" aria-hidden="true" />
                      Tạo lộ trình
                    </Link>
                  </Button>
                  <Dialog.Close asChild>
                    <Button type="button" variant="outline">
                      Quay lại bản đồ
                    </Button>
                  </Dialog.Close>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function InsightTile({
  helper,
  icon: Icon,
  isLoading,
  label,
  value,
}: {
  helper?: string;
  icon: typeof Star;
  isLoading?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-500">
        <Icon className="size-4 text-brand-primary" aria-hidden="true" />
        {label}
      </div>
      <p className={cn("mt-2 truncate text-sm font-black text-slate-950", isLoading && "animate-pulse")}>
        {value}
      </p>
      {helper ? <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p> : null}
    </div>
  );
}

function StatusTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CloudSun;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-brand-outline-variant bg-brand-surface-low p-3">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-500">
        <Icon className="size-4 text-brand-secondary" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-sm font-bold leading-5 text-slate-800">{value}</p>
    </div>
  );
}

function normalizeNumber(value: string | number | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
