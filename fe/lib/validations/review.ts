export type SubmitReviewFormValues = {
  destinationId: string;
  rating: number;
  content: string;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function validateReview(
  values: SubmitReviewFormValues,
): FieldErrors<"destinationId" | "rating" | "content"> {
  const errors: FieldErrors<"destinationId" | "rating" | "content"> = {};

  if (!values.destinationId) {
    errors.destinationId = "Vui lòng chọn địa điểm.";
  }

  if (!values.rating || values.rating < 1 || values.rating > 5) {
    errors.rating = "Vui lòng chọn điểm đánh giá từ 1 đến 5.";
  }

  if (!values.content.trim()) {
    errors.content = "Vui lòng nhập nội dung đánh giá.";
  } else if (values.content.trim().length < 10) {
    errors.content = "Nội dung đánh giá phải có ít nhất 10 ký tự.";
  } else if (values.content.trim().length > 1000) {
    errors.content = "Nội dung đánh giá không được quá 1000 ký tự.";
  }

  return errors;
}

export function hasFieldErrors<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
