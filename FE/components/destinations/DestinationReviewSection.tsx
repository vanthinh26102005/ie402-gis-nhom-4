"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent, type RefObject } from "react";
import { CheckCircle2, Clock3, MapPinned, MessageSquareText, Search, Send, Star } from "lucide-react";
import { AuthStatusMessage } from "@/components/auth/AuthStatusMessage";
import { Button } from "@/components/common/Button";
import { Textarea } from "@/components/common/Textarea";
import { StarRating } from "@/components/reviews/StarRating";
import { getReviewsWithLocal, getReviewSummary, submitReview } from "@/lib/api/reviews";
import { useAuth } from "@/lib/auth/authContext";
import type { Review, ReviewSort, ReviewSummary } from "@/lib/types/review";
import { cn } from "@/lib/utils";
import { hasFieldErrors, validateReview, type FieldErrors } from "@/lib/validations/review";

type DestinationReviewSectionProps = {
  destinationId: string;
  destinationName: string;
};

const emptySummary: ReviewSummary = {
  averageScore: null,
  distribution: [5, 4, 3, 2, 1].map((score) => ({ count: 0, score })),
  totalReviews: 0,
};

const sortOptions: Array<{ label: string; value: ReviewSort }> = [
  { label: "Liên quan nhất", value: "relevant" },
  { label: "Mới nhất", value: "latest" },
  { label: "Điểm cao", value: "highest" },
  { label: "Điểm thấp", value: "lowest" },
];

export function DestinationReviewSection({
  destinationId,
  destinationName,
}: DestinationReviewSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const submittedReviewRef = useRef<HTMLDivElement | null>(null);
  const [summary, setSummary] = useState<ReviewSummary>(emptySummary);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sort, setSort] = useState<ReviewSort>("relevant");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<"destinationId" | "rating" | "content">>({});
  const [status, setStatus] = useState<{ message: string; variant: "error" | "success" } | null>(null);
  const [submittedReview, setSubmittedReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginHref = `/auth/login?redirect=${encodeURIComponent(`/destinations/${destinationId}`)}`;

  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      setIsLoading(true);
      const [nextSummary, nextReviews] = await Promise.all([
        getReviewSummary(destinationId).catch(() => emptySummary),
        getReviewsWithLocal(destinationId, {
          q: query,
          rating: ratingFilter,
          sort,
        }),
      ]);

      if (isMounted) {
        setSummary(nextSummary);
        setReviews(nextReviews);
        setIsLoading(false);
      }
    }

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [destinationId, query, ratingFilter, sort]);

  const maxDistributionCount = useMemo(
    () => Math.max(1, ...summary.distribution.map((item) => item.count)),
    [summary.distribution],
  );

  function clearFieldError(key: keyof typeof fieldErrors) {
    if (fieldErrors[key]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
    if (status) setStatus(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const errors = validateReview({ content, destinationId, rating });
    setFieldErrors(errors);
    if (hasFieldErrors(errors)) return;

    setIsSubmitting(true);
    const result = await submitReview({
      content: content.trim(),
      destinationId,
      rating,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setStatus({ message: normalizeSubmitError(result.message), variant: "error" });
      return;
    }

    const submittedAt = new Date().toISOString();
    setSubmittedReview({
      review_id: result.data?.id ?? `pending-${destinationId}-${submittedAt}`,
      user_name: user?.fullName || user?.name || user?.email || "Bạn",
      destination_id: destinationId,
      content: content.trim(),
      score: rating,
      created_at: submittedAt,
      status: result.data?.status ?? "pending",
    });
    setStatus({ message: "Đã gửi đánh giá. Bạn có thể theo dõi trạng thái bên dưới.", variant: "success" });
    setSort("latest");
    setRatingFilter(null);
    setQuery("");
    setDraftQuery("");
    setRating(0);
    setContent("");
    requestAnimationFrame(() => {
      submittedReviewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200/80 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-primary">
              Đánh giá cộng đồng
            </p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">
              Trải nghiệm tại {destinationName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Xem cảm nhận thực tế từ khách du lịch và chia sẻ trải nghiệm của bạn.
            </p>
          </div>
          <div className="rounded-lg bg-brand-surface-low px-4 py-3 text-right">
            <p className="text-3xl font-black text-slate-950">
              {summary.averageScore?.toFixed(1) ?? "N/A"}
            </p>
            <p className="text-xs font-bold text-slate-500">
              {summary.totalReviews} đánh giá
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          {summary.distribution.map((item) => (
            <button
              key={item.score}
              type="button"
              className={cn(
                "grid grid-cols-[44px_minmax(0,1fr)_40px] items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-brand-surface-low",
                ratingFilter === item.score && "bg-brand-gis-soft",
              )}
              onClick={() => setRatingFilter((current) => current === item.score ? null : item.score)}
            >
              <span className="font-bold text-slate-700">{item.score} sao</span>
              <span className="h-2 overflow-hidden rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-brand-primary"
                  style={{ width: `${(item.count / maxDistributionCount) * 100}%` }}
                />
              </span>
              <span className="text-right text-xs font-bold text-slate-500">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-slate-200/80 p-5">
        {submittedReview ? (
          <SubmittedReviewState
            containerRef={submittedReviewRef}
            destinationId={destinationId}
            review={submittedReview}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {status ? <AuthStatusMessage variant={status.variant} message={status.message} /> : null}
            {!isAuthenticated ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Bạn cần{" "}
                <Link href={loginHref} className="font-bold underline">
                  đăng nhập
                </Link>{" "}
                để viết đánh giá. Sau khi đăng nhập, hệ thống sẽ đưa bạn quay lại địa điểm này.
              </div>
            ) : null}
            <StarRating
              value={rating}
              onChange={(next) => {
                setRating(next);
                clearFieldError("rating");
              }}
              error={fieldErrors.rating}
              id="destination-review-rating"
            />
            <Textarea
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                clearFieldError("content");
              }}
              placeholder="Chia sẻ cảm nhận thực tế của bạn về địa điểm này..."
              aria-invalid={Boolean(fieldErrors.content)}
              className={cn(
                "min-h-28",
                fieldErrors.content && "border-brand-danger focus:border-brand-danger focus:ring-brand-danger/10",
              )}
              disabled={!isAuthenticated || isSubmitting}
            />
            {fieldErrors.content ? <p className="text-xs text-brand-danger">{fieldErrors.content}</p> : null}
            <Button type="submit" disabled={!isAuthenticated || isSubmitting} aria-live="polite">
              <Send className="size-4" aria-hidden="true" />
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </form>
        )}
      </div>

      <div id="reviews-list" className="p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
          <label className="flex min-h-11 items-center gap-2 rounded-lg border border-brand-outline-variant bg-white px-3 focus-within:border-brand-secondary focus-within:ring-2 focus-within:ring-brand-secondary/10">
            <Search className="size-4 text-slate-400" aria-hidden="true" />
            <input
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setQuery(draftQuery);
              }}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              placeholder="Tìm trong đánh giá"
              type="search"
            />
            <button type="button" className="text-xs font-bold text-brand-primary" onClick={() => setQuery(draftQuery)}>
              Tìm
            </button>
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as ReviewSort)}
            className="min-h-11 rounded-lg border border-brand-outline-variant bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 grid gap-4">
          {isLoading ? (
            <div className="rounded-lg bg-brand-surface-low p-4 text-sm text-slate-600">Đang tải đánh giá...</div>
          ) : reviews.length === 0 ? (
            <div className="rounded-lg bg-brand-surface-low p-5 text-center text-sm text-slate-600">
              Chưa có đánh giá phù hợp.
            </div>
          ) : (
            reviews.map((review) => <ReviewCard key={review.review_id} review={review} />)
          )}
        </div>
      </div>
    </section>
  );
}

function SubmittedReviewState({
  containerRef,
  destinationId,
  review,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  destinationId: string;
  review: Review;
}) {
  return (
    <div
      ref={containerRef}
      className="rounded-lg border border-brand-gis/25 bg-brand-gis-soft p-4"
      aria-live="polite"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-brand-secondary ring-1 ring-brand-gis/20">
              <Clock3 className="size-3.5" aria-hidden="true" />
              Đang chờ duyệt
            </span>
            <span className="text-xs font-bold text-slate-500">
              {new Date(review.created_at).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <h3 className="mt-3 flex items-center gap-2 text-lg font-extrabold text-slate-950">
            <CheckCircle2 className="size-5 text-brand-secondary" aria-hidden="true" />
            Đánh giá của bạn đã được gửi
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Nội dung sẽ xuất hiện công khai sau khi được quản trị viên duyệt.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-white/80 bg-white p-4">
        <div className="flex items-center gap-0.5 text-brand-primary">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn("size-4", star <= review.score ? "fill-current" : "text-slate-200")}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700">{review.content}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button asChild>
          <Link href={`/route?end=${encodeURIComponent(destinationId)}`}>
            <MapPinned className="size-4" aria-hidden="true" />
            Tạo lộ trình
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/destinations">Về danh sách điểm đến</Link>
        </Button>
      </div>
    </div>
  );
}

function normalizeSubmitError(message: string) {
  if (/already|duplicate|đã đánh giá|da danh gia/i.test(message)) {
    return "Bạn đã gửi đánh giá cho địa điểm này. Đánh giá có thể đang chờ duyệt hoặc đã được hiển thị.";
  }

  return message || "Không thể gửi đánh giá. Vui lòng thử lại.";
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid size-11 place-items-center rounded-full bg-brand-primary font-bold text-white">
        {review.user_name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-950">{review.user_name}</h3>
          <span className="text-xs text-slate-500">
            {new Date(review.created_at).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <div className="mt-1 flex gap-0.5 text-brand-primary">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn("size-4", star <= review.score ? "fill-current" : "text-slate-200")}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{review.content}</p>
        <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-primary">
          <MessageSquareText className="size-3" aria-hidden="true" />
          Báo cáo đánh giá
        </button>
      </div>
    </article>
  );
}
