import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-brand-card border border-brand-outline-variant bg-brand-surface-lowest p-6 shadow-none",
        className,
      )}
      {...props}
    />
  );
}
