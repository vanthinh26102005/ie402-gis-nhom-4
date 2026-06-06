import { cn } from "@/lib/utils";

type AuthStatusMessageProps = {
  variant: "success" | "error";
  message: string;
};

export function AuthStatusMessage({ variant, message }: AuthStatusMessageProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        variant === "success"
          ? "border-brand-outline-variant bg-brand-surface-low text-brand-secondary"
          : "border-brand-danger/25 bg-brand-surface-low text-brand-danger",
      )}
    >
      {message}
    </div>
  );
}
