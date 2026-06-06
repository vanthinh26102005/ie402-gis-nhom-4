import type { ApiResult } from "@/lib/api/envelope";
import { fetchApi } from "@/lib/api/client";
import type { CreatedTour, CreateTourPayload } from "@/lib/types/tour";

export function fetchTours() {
  return fetchApi<CreatedTour[]>("/tours");
}

export function fetchTour(id: string) {
  return fetchApi<CreatedTour>(`/tours/${id}`);
}

export function updateTour(id: string, payload: Partial<CreateTourPayload>) {
  return fetchApi<CreatedTour>(`/tours/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTour(id: string) {
  return fetchApi<CreatedTour>(`/tours/${id}`, { method: "DELETE" });
}

export async function createTour(payload: CreateTourPayload): Promise<ApiResult<CreatedTour>> {
  try {
    const tour = await fetchApi<CreatedTour>("/tours", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { ok: true, message: "Đã lưu kế hoạch vào tài khoản của bạn.", data: tour };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Không thể lưu kế hoạch. Vui lòng thử lại.",
    };
  }
}
