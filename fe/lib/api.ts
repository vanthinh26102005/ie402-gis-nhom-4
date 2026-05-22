export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type ApiResult<T = void> =
  | { ok: true; data: T; message: string }
  | { ok: false; message: string };

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

const MOCK_EXISTING_EMAIL = "exists@example.com";
const MOCK_INVALID_LOGIN_EMAIL = "wrong@example.com";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Mock login — thay bằng fetch(`${API_BASE_URL}/auth/login`) khi BE sẵn sàng. */
export async function loginUser(payload: LoginPayload): Promise<ApiResult<AuthUser>> {
  await delay(600);

  if (payload.email.trim().toLowerCase() === MOCK_INVALID_LOGIN_EMAIL) {
    return { ok: false, message: "Email hoặc mật khẩu không đúng." };
  }

  return {
    ok: true,
    message: "Đăng nhập thành công.",
    data: {
      id: "mock-user-1",
      email: payload.email.trim(),
      fullName: "Người dùng GIS",
    },
  };
}

/** Mock register — thay bằng fetch(`${API_BASE_URL}/auth/register`) khi BE sẵn sàng. */
export async function registerUser(
  payload: RegisterPayload,
): Promise<ApiResult<AuthUser>> {
  await delay(700);

  if (payload.email.trim().toLowerCase() === MOCK_EXISTING_EMAIL) {
    return { ok: false, message: "Email này đã được sử dụng." };
  }

  return {
    ok: true,
    message: "Đăng ký thành công. Bạn có thể đăng nhập ngay.",
    data: {
      id: "mock-user-new",
      email: payload.email.trim(),
      fullName: payload.fullName.trim(),
    },
  };
}

export type CreateTourPayload = {
  name: string;
  description: string;
  destinationIds: string[];
};

export type CreatedTour = {
  id: string;
  name: string;
  description: string;
  destinationIds: string[];
};

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

/** Mock tạo tour — thay bằng fetch TourPlan khi BE sẵn sàng. */
export async function createTour(
  payload: CreateTourPayload,
): Promise<ApiResult<CreatedTour>> {
  await delay(700);

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

/** Mock gửi đánh giá — thay bằng fetch reviews API khi BE sẵn sàng. */
export async function submitReview(
  payload: SubmitReviewPayload,
): Promise<ApiResult<SubmittedReview>> {
  await delay(600);

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
