"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { cn } from "@/lib/utils";

export type AuthMode = "login" | "register";

type AuthPanelProps = {
  initialMode?: AuthMode;
};

const modeCopy: Record<
  AuthMode,
  { title: string; description: string; switchLabel: string; switchTarget: AuthMode }
> = {
  login: {
    title: "Đăng nhập",
    description: "Đăng nhập để lưu tour và gửi đánh giá địa điểm.",
    switchLabel: "Chưa có tài khoản?",
    switchTarget: "register",
  },
  register: {
    title: "Đăng ký",
    description: "Tạo tài khoản mới để sử dụng đầy đủ tính năng cá nhân.",
    switchLabel: "Đã có tài khoản?",
    switchTarget: "login",
  },
};

export function AuthPanel({ initialMode = "login" }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const copy = modeCopy[mode];

  function switchMode(next: AuthMode) {
    setMode(next);
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {copy.title}
        </h1>
        <p className="text-sm leading-6 text-slate-600">{copy.description}</p>
      </div>

      <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/50">
        <div
          className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
          role="tablist"
          aria-label="Chọn đăng nhập hoặc đăng ký"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => switchMode("login")}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition",
              mode === "login"
                ? "bg-white text-blue-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            onClick={() => switchMode("register")}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition",
              mode === "register"
                ? "bg-white text-blue-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            Đăng ký
          </button>
        </div>

        <div role="tabpanel">
          {mode === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm
              onSuccess={() => {
                switchMode("login");
              }}
            />
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          {copy.switchLabel}{" "}
          <button
            type="button"
            onClick={() => switchMode(copy.switchTarget)}
            className="font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            {copy.switchTarget === "login" ? "Đăng nhập ngay" : "Đăng ký ngay"}
          </button>
        </p>
      </Card>
    </div>
  );
}
