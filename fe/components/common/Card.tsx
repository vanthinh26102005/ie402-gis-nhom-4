import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-brand-card border border-brand-outline-variant/30 bg-brand-surface-lowest p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

