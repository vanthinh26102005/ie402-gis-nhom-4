"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { AuthStatusMessage } from "@/components/auth/AuthStatusMessage";
import { FormField } from "@/components/auth/FormField";
import { loginUser } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  hasFieldErrors,
  validateLogin,
  type FieldErrors,
  type LoginFormValues,
} from "@/lib/validations/auth";

type LoginFormProps = {
  onSuccess?: () => void;
};

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<keyof LoginFormValues>>(
    {},
  );
  const [status, setStatus] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const errors = validateLogin(values);
    setFieldErrors(errors);
    if (hasFieldErrors(errors)) return;

    setIsSubmitting(true);
    try {
      const result = await loginUser({
        email: values.email.trim(),
        password: values.password,
      });

      if (!result.ok) {
        setStatus({ variant: "error", message: result.message });
        return;
      }

      setStatus({ variant: "success", message: result.message });
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

  function updateField<K extends keyof LoginFormValues>(
    key: K,
    value: LoginFormValues[K],
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

      <FormField id="login-email" label="Email" error={fieldErrors.email}>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
          className={cn(fieldErrors.email && "border-red-400 focus:border-red-500 focus:ring-red-100")}
        />
      </FormField>

      <FormField id="login-password" label="Mật khẩu" error={fieldErrors.password}>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => updateField("password", e.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? "login-password-error" : undefined
          }
          className={cn(
            fieldErrors.password && "border-red-400 focus:border-red-500 focus:ring-red-100",
          )}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
