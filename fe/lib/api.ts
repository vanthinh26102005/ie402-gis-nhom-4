export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export type ApiResult<T = void> =
  | { ok: true; data?: T; message: string }
  | { ok: false; message: string };

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterPayload = {
  name?: string;
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role?: string;
  avatar?: string;
  birthday?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  expiresIn: string;
  rememberMe?: boolean;
};

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Login API call */
export async function loginUser(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: payload.email.trim(),
        password: payload.password,
        rememberMe: payload.rememberMe || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        message: errorData.message || "Đăng nhập thất bại.",
      };
    }

    const data = await response.json();
    return {
      ok: true,
      message: data.message || "Đăng nhập thành công.",
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Không thể kết nối máy chủ. Vui lòng thử lại sau.",
    };
  }
}

/** Register API call */
export async function registerUser(
  payload: RegisterPayload,
): Promise<ApiResult<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: payload.fullName || payload.name,
        email: payload.email.trim(),
        password: payload.password,
        confirmPassword: payload.confirmPassword || payload.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        message: errorData.message || "Đăng ký thất bại.",
      };
    }

    const data = await response.json();
    return {
      ok: true,
      message: data.message || "Đăng ký thành công. Bạn có thể đăng nhập ngay.",
      data: data.data,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Không thể kết nối máy chủ. Vui lòng thử lại sau.",
    };
  }
}

/** Logout API call */
export async function logoutUser(): Promise<ApiResult<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return {
        ok: false,
        message: "Đăng xuất thất bại.",
      };
    }

    return {
      ok: true,
      message: "Đã đăng xuất thành công.",
    };
  } catch (error) {
    return {
      ok: false,
      message: "Không thể kết nối máy chủ.",
    };
  }
}

/** Forgot password API call */
export async function forgotPassword(payload: {
  email: string;
}): Promise<ApiResult<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: payload.email.trim(),
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: "Yêu cầu thất bại.",
      };
    }

    const data = await response.json();
    return {
      ok: true,
      message: data.message || "Nếu email tồn tại, bạn sẽ nhận được email đặt lại mật khẩu.",
    };
  } catch (error) {
    return {
      ok: false,
      message: "Không thể kết nối máy chủ.",
    };
  }
}

/** Reset password API call */
export async function resetPassword(payload: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ApiResult<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${payload.token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        message: errorData.message || "Đặt lại mật khẩu thất bại.",
      };
    }

    const data = await response.json();
    return {
      ok: true,
      message: data.message || "Mật khẩu đã được đặt lại thành công.",
    };
  } catch (error) {
    return {
      ok: false,
      message: "Không thể kết nối máy chủ.",
    };
  }
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
