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
        <h1 className="text-[28px] font-bold leading-[1.43] tracking-normal text-brand-secondary">
          {copy.title}
        </h1>
        <p className="text-sm leading-6 text-[#6a6a6a]">{copy.description}</p>
      </div>

      <Card>
        <div
          className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-brand-outline-variant bg-brand-surface-low p-1"
          role="tablist"
          aria-label="Chọn đăng nhập hoặc đăng ký"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => switchMode("login")}
            className={cn(
              "rounded-full px-3 py-2 text-sm font-medium transition-[background-color,color,box-shadow]",
              mode === "login"
                ? "bg-white text-brand-secondary shadow-[var(--shadow-brand-map)]"
                : "text-[#6a6a6a] hover:text-brand-secondary",
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
              "rounded-full px-3 py-2 text-sm font-medium transition-[background-color,color,box-shadow]",
              mode === "register"
                ? "bg-white text-brand-secondary shadow-[var(--shadow-brand-map)]"
                : "text-[#6a6a6a] hover:text-brand-secondary",
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

        <p className="mt-6 text-center text-sm text-[#6a6a6a]">
          {copy.switchLabel}{" "}
          <button
            type="button"
            onClick={() => switchMode(copy.switchTarget)}
            className="font-medium text-brand-primary underline-offset-2 hover:underline"
          >
            {copy.switchTarget === "login" ? "Đăng nhập ngay" : "Đăng ký ngay"}
          </button>
        </p>
      </Card>
    </div>
  );
}
