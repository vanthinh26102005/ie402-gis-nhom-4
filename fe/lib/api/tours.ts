import type { ApiResult } from "@/lib/api/envelope";
import type { CreatedTour, CreateTourPayload } from "@/lib/types/tour";

export async function createTour(
  payload: CreateTourPayload,
): Promise<ApiResult<CreatedTour>> {
  await new Promise((resolve) => {
    setTimeout(resolve, 700);
  });

  if (payload.name.trim().toLowerCase() === "tour loi") {
    return { ok: false, message: "Không thể lưu tour. Vui lòng thử tên khác." };
  }

  return {
    ok: true,
    message: "Đã lưu tour nháp thành công.",
    data: {
      id: `tour-${Date.now()}`,
      name: payload.name.trim(),
      description: payload.description.trim(),
      destinationIds: payload.destinationIds,
    },
  };
}
