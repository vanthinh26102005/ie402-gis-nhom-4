"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Check, ArrowLeft, EyeOff, Trash2, MapPinned, User, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { RatingBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { mockReviews, type Review } from "@/lib/admin-data";

interface ModerateReviewPageProps {
  params: Promise<{ id: string }>;
}

export default function ModerateReviewPage({ params }: ModerateReviewPageProps) {
  const { id } = use(params);
  const [currentStatus, setCurrentStatus] = useState<Review["status"] | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const review = mockReviews.find((r) => r.id === id);

  if (!review) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Không tìm thấy</h1>
          <p className="mt-2 text-slate-600">Đánh giá không tồn tại.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/reviews">Quay lại</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayReview = {
    ...review,
    status: currentStatus || review.status,
  };

const statusLabels = {
  approved: { label: "Đã duyệt", type: "success" as const },
  pending: { label: "Chờ duyệt", type: "warning" as const },
  hidden: { label: "Đã ẩn", type: "pending" as const },
  rejected: { label: "Từ chối", type: "error" as const },
} as const;

  const handleAction = async (action: "approve" | "hide" | "reject") => {
    setActionLoading(action);
    await new Promise((resolve) => setTimeout(resolve, 800));

    switch (action) {
      case "approve":
        setCurrentStatus("approved");
        break;
      case "hide":
        setCurrentStatus("hidden");
        break;
      case "reject":
        setCurrentStatus("rejected");
        break;
    }

    setActionLoading(null);
  };

  const isSuspiciousContent = review.content.length > 0 &&
    (review.content === review.content.toUpperCase() && review.content.length > 50 ||
     review.content.includes("PHẢN ĐỘNG") ||
     review.content.includes("CỘNG SẢN"));

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
            Kiểm tra nội dung đánh giá trước khi hiển thị hoặc xử lý vi phạm.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <User className="size-5 text-slate-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{displayReview.user_name}</p>
                  <p className="text-sm text-slate-500">ID: {displayReview.user_id}</p>
                </div>
              </div>
              <StatusBadge
                status={statusLabels[displayReview.status].type}
                label={statusLabels[displayReview.status].label}
              />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MapPinned className="size-4 text-slate-400" aria-hidden="true" />
                <span className="font-medium text-slate-700">{displayReview.destination_name}</span>
              </div>
              <RatingBadge score={displayReview.rating} />
            </div>

            {isSuspiciousContent && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-4 border border-red-200">
                <AlertTriangle className="size-5 text-red-600 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-red-800">Cảnh báo nội dung đáng nghi</p>
                  <p className="text-sm text-red-700 mt-1">
                    Đánh giá này có thể chứa nội dung vi phạm hoặc spam. Hãy kiểm tra kỹ trước khi duyệt.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <p className="text-slate-700 whitespace-pre-wrap">{displayReview.content}</p>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                <span>{new Date(displayReview.created_at).toLocaleString("vi-VN")}</span>
              </div>
              {displayReview.updated_at !== displayReview.created_at && (
                <div className="flex items-center gap-1.5">
                  <span>Cập nhật: {new Date(displayReview.updated_at).toLocaleString("vi-VN")}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-semibold text-slate-950">Hành động</h2>
            <p className="mt-1 text-sm text-slate-600">
              Chọn hành động phù hợp với nội dung đánh giá này.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => handleAction("approve")}
                disabled={actionLoading !== null || displayReview.status === "approved"}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {actionLoading === "approve" ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    <Check className="mr-2 size-4" aria-hidden="true" />
                    Duyệt đánh giá
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleAction("hide")}
                disabled={actionLoading !== null || displayReview.status === "hidden"}
                variant="outline"
              >
                {actionLoading === "hide" ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    <EyeOff className="mr-2 size-4" aria-hidden="true" />
                    Ẩn đánh giá
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleAction("reject")}
                disabled={actionLoading !== null || displayReview.status === "rejected"}
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                {actionLoading === "reject" ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    <Trash2 className="mr-2 size-4" aria-hidden="true" />
                    Từ chối
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-base font-semibold text-slate-950">Thông tin đánh giá</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID đánh giá</span>
                <span className="font-mono text-slate-700">{displayReview.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Điểm số</span>
                <span className="font-medium text-slate-700">{displayReview.rating}/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ngày tạo</span>
                <span className="text-slate-700">
                  {new Date(displayReview.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-semibold text-slate-950">Hướng dẫn</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Duyệt đánh giá tích cực, có nội dung phù hợp</span>
              </li>
              <li className="flex items-start gap-2">
                <EyeOff className="size-4 text-amber-500 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Ẩn đánh giá vi phạm nhẹ, spam hoặc không phù hợp</span>
              </li>
              <li className="flex items-start gap-2">
                <Trash2 className="size-4 text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Từ chối đánh giá chứa nội dung phản động, thô tục</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
