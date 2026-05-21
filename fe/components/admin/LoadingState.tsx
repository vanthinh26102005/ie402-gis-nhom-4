"use client";

import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-3",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-slate-200 border-t-primary",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Đang tải"
    />
  );
}

type LoadingOverlayProps = {
  message?: string;
  className?: string;
};

export function LoadingOverlay({ message = "Đang tải...", className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/80 backdrop-blur-sm",
        className
      )}
    >
      <LoadingSpinner size="lg" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
  className?: string;
};

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-4 w-24 animate-pulse rounded bg-slate-200"
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-8 w-full animate-pulse rounded bg-slate-100"
              style={{ maxWidth: colIndex === 0 ? "200px" : `${100 - colIndex * 15}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

type CardSkeletonProps = {
  className?: string;
};

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

type StatsSkeletonProps = {
  count?: number;
  className?: string;
};

export function StatsSkeleton({ count = 4, className }: StatsSkeletonProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
