"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  id?: string;
};

export function StarRating({ value, onChange, error, id = "review-rating" }: StarRatingProps) {
  return (
    <div className="space-y-1.5">
      <div
        id={id}
        role="radiogroup"
        aria-label="Điểm đánh giá từ 1 đến 5 sao"
        aria-invalid={Boolean(error)}
        className="flex gap-1"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= value;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} sao`}
              onClick={() => onChange(star)}
              className={cn(
                "rounded-md p-1 transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200",
                error && "ring-1 ring-red-300",
              )}
            >
              <Star
                className={cn(
                  "size-8",
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-slate-300",
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
      {value > 0 ? (
        <p className="text-xs text-slate-600">Bạn chọn {value}/5 sao</p>
      ) : (
        <p className="text-xs text-slate-500">Chọn số sao cho địa điểm</p>
      )}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
