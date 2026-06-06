"use client";

import { useState, type FormEvent } from "react";
import { AuthStatusMessage } from "@/components/auth/AuthStatusMessage";
import { FormField } from "@/components/auth/FormField";
import { StarRating } from "@/components/reviews/StarRating";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { submitReview } from "@/lib/api";
import { useDestinations } from "@/lib/hooks/useDestinations";
import { cn } from "@/lib/utils";
import {
  hasFieldErrors,
  validateReview,
  type FieldErrors,
} from "@/lib/validations/review";

export function SubmitReviewForm() {
  const { destinations, error: destinationsError, isLoading } = useDestinations();
  const [destinationId, setDestinationId] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<"destinationId" | "rating" | "content">
  >({});
  const [status, setStatus] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const destinationOptions = destinations.map((destination) => ({
    label: `${destination.name} (${destination.province.name})`,
    value: destination.id,
  }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const errors = validateReview({ destinationId, rating, content });
    setFieldErrors(errors);
    if (hasFieldErrors(errors)) return;

    setIsSubmitting(true);
    try {
      const result = await submitReview({
        destinationId,
        rating,
        content: content.trim(),
      });

      if (!result.ok) {
        setStatus({ variant: "error", message: result.message });
        return;
      }

      setStatus({ variant: "success", message: result.message });
      setDestinationId("");
      setRating(0);
      setContent("");
    } catch {
      setStatus({
        variant: "error",
        message: "Không thể kết nối máy chủ. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearFieldError(key: keyof typeof fieldErrors) {
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
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {status ? (
        <AuthStatusMessage variant={status.variant} message={status.message} />
      ) : null}

      <FormField
        id="review-destination"
        label="Địa điểm"
        error={fieldErrors.destinationId || destinationsError || undefined}
      >
        <Select
          id="review-destination"
          value={destinationId}
          onChange={(e) => {
            setDestinationId(e.target.value);
            clearFieldError("destinationId");
          }}
          options={[
            {
              label: isLoading ? "Đang tải điểm du lịch…" : "Chọn điểm du lịch…",
              value: "",
            },
            ...destinationOptions,
          ]}
          disabled={isLoading || Boolean(destinationsError)}
          aria-invalid={Boolean(fieldErrors.destinationId)}
          className={cn(
            fieldErrors.destinationId &&
              "border-brand-danger focus:border-brand-danger focus:ring-brand-danger/10",
          )}
        />
      </FormField>

      <FormField id="review-rating-field" label="Điểm đánh giá">
        <StarRating
          value={rating}
          onChange={(next) => {
            setRating(next);
            clearFieldError("rating");
          }}
          error={fieldErrors.rating}
        />
      </FormField>

      <FormField id="review-content" label="Nội dung đánh giá" error={fieldErrors.content}>
        <Textarea
          id="review-content"
          placeholder="Chia sẻ trải nghiệm của bạn tại địa điểm này…"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            clearFieldError("content");
          }}
          aria-invalid={Boolean(fieldErrors.content)}
          className={cn(
            fieldErrors.content && "border-brand-danger focus:border-brand-danger focus:ring-brand-danger/10",
          )}
        />
        <p className="text-xs text-[#6a6a6a]">Tối thiểu 10 ký tự</p>
      </FormField>

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={isSubmitting || isLoading || Boolean(destinationsError)}
      >
        {isSubmitting ? "Đang gửi…" : "Gửi đánh giá"}
      </Button>
    </form>
  );
}
