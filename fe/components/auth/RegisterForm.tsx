"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { AuthStatusMessage } from "@/components/auth/AuthStatusMessage";
import { FormField } from "@/components/auth/FormField";
import { registerUser } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  hasFieldErrors,
  validateRegister,
  type FieldErrors,
  type RegisterFormValues,
} from "@/lib/validations/auth";

type RegisterFormProps = {
  onSuccess?: () => void;
};

const initialValues: RegisterFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<keyof RegisterFormValues>
  >({});
  const [status, setStatus] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const errors = validateRegister(values);
    setFieldErrors(errors);
    if (hasFieldErrors(errors)) return;

    setIsSubmitting(true);
    try {
      const result = await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      if (!result.ok) {
        setStatus({ variant: "error", message: result.message });
        return;
      }

      setStatus({ variant: "success", message: result.message });
      setValues(initialValues);
      onSuccess?.();
    } catch {
      setStatus({
        variant: "error",
        message: "Không thể kết nối máy chủ. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (status) setStatus(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {status ? (
        <AuthStatusMessage variant={status.variant} message={status.message} />
      ) : null}

      <FormField id="register-fullName" label="Họ và tên" error={fieldErrors.fullName}>
        <Input
          id="register-fullName"
          type="text"
          autoComplete="name"
          placeholder="Nguyễn Văn A"
          value={values.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          aria-invalid={Boolean(fieldErrors.fullName)}
          className={cn(
            fieldErrors.fullName && "border-red-400 focus:border-red-500 focus:ring-red-100",
          )}
        />
      </FormField>

      <FormField id="register-email" label="Email" error={fieldErrors.email}>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          className={cn(
            fieldErrors.email && "border-red-400 focus:border-red-500 focus:ring-red-100",
          )}
        />
      </FormField>

      <FormField id="register-password" label="Mật khẩu" error={fieldErrors.password}>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Ít nhất 6 ký tự"
          value={values.password}
          onChange={(e) => updateField("password", e.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          className={cn(
            fieldErrors.password && "border-red-400 focus:border-red-500 focus:ring-red-100",
          )}
        />
      </FormField>

      <FormField
        id="register-confirmPassword"
        label="Xác nhận mật khẩu"
        error={fieldErrors.confirmPassword}
      >
        <Input
          id="register-confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          value={values.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          className={cn(
            fieldErrors.confirmPassword &&
              "border-red-400 focus:border-red-500 focus:ring-red-100",
          )}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>
    </form>
  );
}
