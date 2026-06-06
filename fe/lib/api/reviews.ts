import { fetchApi } from "@/lib/api/client";
import type { ApiResult } from "@/lib/api/envelope";
import type { Review, ReviewSort, ReviewSummary } from "@/lib/types/review";

export type SubmitReviewPayload = {
  destinationId: string;
  rating: number;
  content: string;
};

export type SubmittedReview = {
  id: string;
  destinationId: string;
  score: number;
  content: string;
  status: "pending" | "published" | "hidden";
};

function mapReviewPayload(
  review: {
    id: string;
    destinationId?: string;
    destination_id?: string;
    content: string;
    score: number;
    createdAt?: string;
    created_at?: string;
    userName?: string;
    user_name?: string;
  },
  destinationId: string,
): Review {
  return {
    review_id: review.id,
    user_name: review.userName || review.user_name || "Khách du lịch",
    destination_id: review.destinationId || review.destination_id || destinationId,
    content: review.content,
    score: review.score,
    created_at: review.createdAt || review.created_at || new Date().toISOString(),
  };
}

export async function getReviewSummary(destinationId: string): Promise<ReviewSummary> {
  return fetchApi<ReviewSummary>(`/reviews/summary?destinationId=${encodeURIComponent(destinationId)}`);
}

export async function getReviewsWithLocal(
  destinationId: string,
  filters?: {
    q?: string;
    rating?: number | null;
    sort?: ReviewSort;
  },
): Promise<Review[]> {
  try {
    const params = new URLSearchParams({ destinationId });
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.rating) params.set("rating", String(filters.rating));
    if (filters?.q?.trim()) params.set("q", filters.q.trim());
    const reviews = await fetchApi<Array<Parameters<typeof mapReviewPayload>[0]>>(`/reviews?${params.toString()}`);

    return reviews.map((review) => mapReviewPayload(review, destinationId));
  } catch {
    return [];
  }
}

export async function addReview(
  destinationId: string,
  payload: { user_name: string; content: string; score: number },
) {
  await submitReview({
    destinationId,
    rating: payload.score,
    content: payload.content,
  });
}

export async function submitReview(
  payload: SubmitReviewPayload,
): Promise<ApiResult<SubmittedReview>> {
  try {
    const review = await fetchApi<SubmittedReview>("/reviews", {
      method: "POST",
      body: JSON.stringify({
        content: payload.content.trim(),
        destinationId: payload.destinationId,
        score: payload.rating,
      }),
    });

    return {
      ok: true,
      message: "Đã gửi đánh giá. Đang chờ kiểm duyệt.",
      data: review,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Không thể gửi đánh giá.",
    };
  }
}
