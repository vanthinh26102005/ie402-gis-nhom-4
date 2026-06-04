import { API_BASE_URL } from "@/lib/api/client";
import type { ApiResult } from "@/lib/api/envelope";

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

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const payload = await response.json();
    return payload.message || payload.error?.message || fallback;
  } catch {
    return fallback;
  }
}

export async function loginUser(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: payload.email.trim(),
        password: payload.password,
        rememberMe: payload.rememberMe || false,
      }),
    });

    if (!response.ok) {
      return { ok: false, message: await readErrorMessage(response, "Đăng nhập thất bại.") };
    }

    const data = await response.json();
    return { ok: true, message: data.message || "Đăng nhập thành công.", data: data.data };
  } catch {
    return { ok: false, message: "Không thể kết nối máy chủ. Vui lòng thử lại sau." };
  }
}

export async function registerUser(payload: RegisterPayload): Promise<ApiResult<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: payload.fullName || payload.name,
        email: payload.email.trim(),
        password: payload.password,
        confirmPassword: payload.confirmPassword || payload.password,
      }),
    });

    if (!response.ok) {
      return { ok: false, message: await readErrorMessage(response, "Đăng ký thất bại.") };
    }

    const data = await response.json();
    return {
      ok: true,
      message: data.message || "Đăng ký thành công. Bạn có thể đăng nhập ngay.",
      data: data.data,
    };
  } catch {
    return { ok: false, message: "Không thể kết nối máy chủ. Vui lòng thử lại sau." };
  }
}

export async function logoutUser(): Promise<ApiResult<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      return { ok: false, message: "Đăng xuất thất bại." };
    }

    return { ok: true, message: "Đã đăng xuất thành công." };
  } catch {
    return { ok: false, message: "Không thể kết nối máy chủ." };
  }
}

export async function forgotPassword(payload: { email: string }): Promise<ApiResult<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: payload.email.trim() }),
    });

    if (!response.ok) {
      return { ok: false, message: "Yêu cầu thất bại." };
    }

    const data = await response.json();
    return {
      ok: true,
      message: data.message || "Nếu email tồn tại, bạn sẽ nhận được email đặt lại mật khẩu.",
    };
  } catch {
    return { ok: false, message: "Không thể kết nối máy chủ." };
  }
}

export async function resetPassword(payload: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ApiResult<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${payload.token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      }),
    });

    if (!response.ok) {
      return { ok: false, message: await readErrorMessage(response, "Đặt lại mật khẩu thất bại.") };
    }

    const data = await response.json();
    return { ok: true, message: data.message || "Mật khẩu đã được đặt lại thành công." };
  } catch {
    return { ok: false, message: "Không thể kết nối máy chủ." };
  }
}
