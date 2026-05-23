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
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  error: "bg-red-50 text-red-800 border-red-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
  pending: "bg-slate-100 text-slate-600 border-slate-200",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusDotStyles: Record<StatusType, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  pending: "bg-slate-400",
  default: "bg-slate-400",
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
  let colorClass = "bg-slate-100 text-slate-600 border-slate-200";

  if (percentage >= 80) {
    colorClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (percentage >= 60) {
    colorClass = "bg-blue-50 text-blue-800 border-blue-200";
  } else if (percentage >= 40) {
    colorClass = "bg-amber-50 text-amber-800 border-amber-200";
  } else {
    colorClass = "bg-red-50 text-red-800 border-red-200";
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
      className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 border border-teal-200"
      style={color ? { backgroundColor: `${color}15`, color, borderColor: `${color}30` } : undefined}
    >
      {label}
    </span>
  );
}
