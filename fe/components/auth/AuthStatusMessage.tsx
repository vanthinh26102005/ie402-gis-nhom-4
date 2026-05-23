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
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-900",
      )}
    >
      {message}
    </div>
  );
}
