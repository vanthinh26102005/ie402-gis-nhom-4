import { fetchApi } from "@/lib/api/client";
import type { ApiResult } from "@/lib/api/envelope";
import type { Review } from "@/lib/types/review";

export type SubmitReviewPayload = {
  destinationId: string;
  rating: number;
  content: string;
};

export type SubmittedReview = {
  id: string;
  destinationId: string;
  rating: number;
  content: string;
  status: "pending" | "approved";
};

export async function getReviewsWithLocal(destinationId: string): Promise<Review[]> {
  try {
    const reviews = await fetchApi<Array<{
      id: string;
      destinationId?: string;
      destination_id?: string;
      content: string;
      score: number;
      createdAt?: string;
      created_at?: string;
      userName?: string;
      user_name?: string;
    }>>(`/reviews?destinationId=${encodeURIComponent(destinationId)}`);

    return reviews.map((review) => ({
      review_id: review.id,
      user_name: review.userName || review.user_name || "Khách du lịch",
      destination_id: review.destinationId || review.destination_id || destinationId,
      content: review.content,
      score: review.score,
      created_at: review.createdAt || review.created_at || new Date().toISOString(),
    }));
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
  await new Promise((resolve) => {
    setTimeout(resolve, 600);
  });

  if (payload.content.trim().toLowerCase().includes("spam")) {
    return {
      ok: false,
      message: "Nội dung đánh giá không hợp lệ. Vui lòng chỉnh sửa và gửi lại.",
    };
  }

  return {
    ok: true,
    message: "Đã gửi đánh giá. Đang chờ kiểm duyệt.",
    data: {
      id: `review-${Date.now()}`,
      destinationId: payload.destinationId,
      rating: payload.rating,
      content: payload.content.trim(),
      status: "pending",
    },
  };
}
