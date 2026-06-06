"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatusType = "success" | "warning" | "error" | "info" | "pending" | "default";

type StatusBadgeProps = {
  status: StatusType;
  label: string;
  icon?: LucideIcon;
  className?: string;
};

const statusStyles: Record<StatusType, string> = {
  success: "bg-brand-surface-low text-brand-secondary border-brand-outline-variant",
  warning: "bg-brand-surface-low text-brand-danger border-brand-danger/25",
  error: "bg-brand-surface-low text-brand-danger border-brand-danger/25",
  info: "bg-brand-surface-low text-brand-secondary border-brand-outline-variant",
  pending: "bg-brand-surface-low text-[#6a6a6a] border-brand-outline-variant",
  default: "bg-brand-surface-low text-brand-secondary border-brand-outline-variant",
};

const statusDotStyles: Record<StatusType, string> = {
  success: "bg-brand-secondary",
  warning: "bg-brand-danger",
  error: "bg-brand-danger",
  info: "bg-brand-primary",
  pending: "bg-[#6a6a6a]",
  default: "bg-[#6a6a6a]",
};

export function StatusBadge({ status, label, icon: Icon, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", statusDotStyles[status])} />
      {Icon && <Icon className="size-3" aria-hidden="true" />}
      {label}
    </span>
  );
}

export function RatingBadge({ score, max = 5 }: { score: number; max?: number }) {
  const percentage = (score / max) * 100;
  let colorClass = "bg-brand-surface-low text-[#6a6a6a] border-brand-outline-variant";

  if (percentage >= 80) {
    colorClass = "bg-brand-surface-low text-brand-secondary border-brand-outline-variant";
  } else if (percentage >= 60) {
    colorClass = "bg-brand-surface-low text-brand-secondary border-brand-outline-variant";
  } else if (percentage >= 40) {
    colorClass = "bg-brand-surface-low text-brand-danger border-brand-danger/25";
  } else {
    colorClass = "bg-brand-surface-low text-brand-danger border-brand-danger/25";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        colorClass
      )}
    >
      {score.toFixed(1)}/{max}
    </span>
  );
}

export function CategoryBadge({ label, color }: { label: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-brand-outline-variant bg-brand-surface-low px-2.5 py-1 text-xs font-medium text-brand-secondary"
      style={color ? { backgroundColor: `${color}15`, color, borderColor: `${color}30` } : undefined}
    >
      {label}
    </span>
  );
}
