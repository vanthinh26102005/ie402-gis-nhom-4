export type CreateTourFormValues = {
  name: string;
  description: string;
  destinationIds: string[];
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function validateCreateTour(
  values: CreateTourFormValues,
): FieldErrors<"name" | "description" | "destinations"> {
  const errors: FieldErrors<"name" | "description" | "destinations"> = {};

  if (!values.name.trim()) {
    errors.name = "Vui lòng nhập tên tour.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Tên tour phải có ít nhất 3 ký tự.";
  }

  if (values.description.trim().length > 500) {
    errors.description = "Mô tả không được quá 500 ký tự.";
  }

  if (values.destinationIds.length === 0) {
    errors.destinations = "Chọn ít nhất một điểm đến.";
  }

  return errors;
}

export function hasFieldErrors<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
