"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, Check, Clock, EyeOff, MapPinned, Trash2, User } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { RatingBadge, StatusBadge } from "@/components/admin/StatusBadge";
import {
  getAdminReview,
  moderateAdminReview,
  type AdminReview,
} from "@/lib/api/admin";

interface ModerateReviewPageProps {
  params: Promise<{ id: string }>;
}

const statusLabels = {
  hidden: { label: "Đã ẩn", type: "pending" as const },
  pending: { label: "Chờ duyệt", type: "warning" as const },
  published: { label: "Đã duyệt", type: "success" as const },
} as const;

export default function ModerateReviewPage({ params }: ModerateReviewPageProps) {
  const { id } = use(params);
  const [review, setReview] = useState<AdminReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"hidden" | "published" | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReview() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const nextReview = await getAdminReview(id);
        if (isMounted) setReview(nextReview);
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Không thể tải đánh giá.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReview();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isSuspiciousContent = useMemo(() => {
    const content = review?.content || "";
    return Boolean(
      content.length > 50 && content === content.toUpperCase()
      || content.toLowerCase().includes("spam")
      || content.includes("PHẢN ĐỘNG")
      || content.includes("CỘNG SẢN"),
    );
  }, [review?.content]);

  async function handleModerate(nextStatus: "hidden" | "published") {
    try {
      setActionLoading(nextStatus);
      setActionError(null);
      const nextReview = await moderateAdminReview(id, nextStatus);
      setReview(nextReview);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Không thể cập nhật trạng thái đánh giá.");
    } finally {
      setActionLoading(null);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm">
        Đang tải đánh giá…
      </div>
    );
  }

  if (loadError || !review) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Không tìm thấy</h1>
          <p className="mt-2 text-slate-600">{loadError || "Đánh giá không tồn tại."}</p>
          <Button asChild className="mt-4">
            <Link href="/admin/reviews">Quay lại</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = statusLabels[review.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/reviews">
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Kiểm duyệt đánh giá
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Kiểm tra nội dung đánh giá từ PostgreSQL trước khi hiển thị công khai.
          </p>
        </div>
      </div>

      {actionError ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-100">
                  <User className="size-5 text-slate-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{review.userName}</p>
                  <p className="text-sm text-slate-500">ID: {review.userId || review.id}</p>
                </div>
              </div>
              <StatusBadge status={statusConfig.type} label={statusConfig.label} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MapPinned className="size-4 text-slate-400" aria-hidden="true" />
                <span className="font-medium text-slate-700">{review.destinationName}</span>
              </div>
              <RatingBadge score={review.score} />
            </div>

            {isSuspiciousContent ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 size-5 text-red-600" aria-hidden="true" />
                <div>
                  <p className="font-medium text-red-800">Cảnh báo nội dung đáng nghi</p>
                  <p className="mt-1 text-sm text-red-700">
                    Đánh giá này có thể chứa nội dung vi phạm hoặc spam. Hãy kiểm tra kỹ trước khi duyệt.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-slate-700">
                {review.content || "Không có nội dung đánh giá."}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                <span>
                  {review.createdAt ? new Date(review.createdAt).toLocaleString("vi-VN") : "Chưa có ngày tạo"}
                </span>
              </div>
              {review.updatedAt && review.updatedAt !== review.createdAt ? (
                <span>Cập nhật: {new Date(review.updatedAt).toLocaleString("vi-VN")}</span>
              ) : null}
            </div>
          </Card>

          <Card className="rounded-lg p-6">
            <h2 className="text-base font-semibold text-slate-950">Hành động</h2>
            <p className="mt-1 text-sm text-slate-600">
              Duyệt để hiển thị công khai hoặc ẩn nếu nội dung không phù hợp.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => handleModerate("published")}
                disabled={actionLoading !== null || review.status === "published"}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {actionLoading === "published" ? (
                  "Đang xử lý…"
                ) : (
                  <>
                    <Check className="mr-2 size-4" aria-hidden="true" />
                    Duyệt đánh giá
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleModerate("hidden")}
                disabled={actionLoading !== null || review.status === "hidden"}
                variant="outline"
              >
                {actionLoading === "hidden" ? (
                  "Đang xử lý…"
                ) : (
                  <>
                    <EyeOff className="mr-2 size-4" aria-hidden="true" />
                    Ẩn đánh giá
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-lg p-6">
            <h2 className="text-base font-semibold text-slate-950">Thông tin đánh giá</h2>
            <div className="mt-4 space-y-3">
              <InfoRow label="ID đánh giá" value={review.id} mono />
              <InfoRow label="Điểm số" value={`${review.score}/5`} />
              <InfoRow label="Trạng thái" value={statusConfig.label} />
              <InfoRow
                label="Ngày tạo"
                value={review.createdAt ? new Date(review.createdAt).toLocaleDateString("vi-VN") : "-"}
              />
            </div>
          </Card>

          <Card className="rounded-lg p-6">
            <h2 className="text-base font-semibold text-slate-950">Hướng dẫn</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden="true" />
                <span>Duyệt đánh giá có nội dung cụ thể, liên quan đúng địa điểm.</span>
              </li>
              <li className="flex items-start gap-2">
                <EyeOff className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />
                <span>Ẩn đánh giá spam, xúc phạm, hoặc không liên quan trải nghiệm du lịch.</span>
              </li>
              <li className="flex items-start gap-2">
                <Trash2 className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden="true" />
                <span>Xóa cứng chưa hỗ trợ; trạng thái ẩn là cách xử lý an toàn hiện tại.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, mono = false, value }: { label: string; mono?: boolean; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={mono ? "break-all text-right font-mono text-slate-700" : "text-right font-medium text-slate-700"}>
        {value}
      </span>
    </div>
  );
}
