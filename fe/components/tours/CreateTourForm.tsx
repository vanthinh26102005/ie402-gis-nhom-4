"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AuthStatusMessage } from "@/components/auth/AuthStatusMessage";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { SelectedDestinationsList } from "@/components/tours/SelectedDestinationsList";
import { createTour } from "@/lib/api";
import {
  getDestinationById,
  MOCK_DESTINATIONS,
} from "@/lib/data/destinations";
import { cn } from "@/lib/utils";
import {
  hasFieldErrors,
  validateCreateTour,
  type FieldErrors,
} from "@/lib/validations/tour";

export function CreateTourForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [destinationIds, setDestinationIds] = useState<string[]>([]);
  const [pickerValue, setPickerValue] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<"name" | "description" | "destinations">
  >({});
  const [status, setStatus] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDestinations = useMemo(
    () =>
      destinationIds
        .map((id) => getDestinationById(id))
        .filter((d): d is NonNullable<typeof d> => Boolean(d)),
    [destinationIds],
  );

  const availableOptions = useMemo(
    () =>
      MOCK_DESTINATIONS.filter((d) => !destinationIds.includes(d.id)).map(
        (d) => ({
          label: `${d.name} (${d.province})`,
          value: d.id,
        }),
      ),
    [destinationIds],
  );

  function addDestination() {
    if (!pickerValue || destinationIds.includes(pickerValue)) return;
    setDestinationIds((prev) => [...prev, pickerValue]);
    setPickerValue("");
    if (fieldErrors.destinations) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.destinations;
        return next;
      });
    }
    if (status) setStatus(null);
  }

  function moveDestination(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= destinationIds.length) return;
    setDestinationIds((prev) => {
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function removeDestination(index: number) {
    setDestinationIds((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const errors = validateCreateTour({ name, description, destinationIds });
    setFieldErrors(errors);
    if (hasFieldErrors(errors)) return;

    setIsSubmitting(true);
    try {
      const result = await createTour({
        name: name.trim(),
        description: description.trim(),
        destinationIds,
      });

      if (!result.ok) {
        setStatus({ variant: "error", message: result.message });
        return;
      }

      setStatus({ variant: "success", message: result.message });
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {status ? (
        <AuthStatusMessage variant={status.variant} message={status.message} />
      ) : null}

      <div className="grid gap-4">
        <FormField id="tour-name" label="Tên tour" error={fieldErrors.name}>
          <Input
            id="tour-name"
            placeholder="VD: Khám phá di sản miền Trung"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            aria-invalid={Boolean(fieldErrors.name)}
            className={cn(
              fieldErrors.name && "border-red-400 focus:border-red-500 focus:ring-red-100",
            )}
          />
        </FormField>

        <FormField
          id="tour-description"
          label="Mô tả"
          error={fieldErrors.description}
        >
          <Textarea
            id="tour-description"
            placeholder="Mô tả ngắn về hành trình, thời gian dự kiến, ghi chú..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearFieldError("description");
            }}
            aria-invalid={Boolean(fieldErrors.description)}
            className={cn(
              fieldErrors.description &&
                "border-red-400 focus:border-red-500 focus:ring-red-100",
            )}
          />
          <p className="text-xs text-slate-500">{description.length}/500 ký tự</p>
        </FormField>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Điểm đến đã chọn</h2>
          <p className="text-xs text-slate-500">
            Dùng nút mũi tên để sắp xếp thứ tự tham quan.
          </p>
        </div>

        <SelectedDestinationsList
          items={selectedDestinations}
          onMoveUp={(index) => moveDestination(index, -1)}
          onMoveDown={(index) => moveDestination(index, 1)}
          onRemove={removeDestination}
        />

        {fieldErrors.destinations ? (
          <p className="text-sm text-red-600" role="alert">
            {fieldErrors.destinations}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={pickerValue}
            onChange={(e) => setPickerValue(e.target.value)}
            options={[
              { label: "Chọn điểm du lịch...", value: "" },
              ...availableOptions,
            ]}
            className="flex-1"
            aria-label="Chọn điểm đến để thêm"
          />
          <Button
            type="button"
            variant="outline"
            className="shrink-0 border-blue-300 bg-white text-blue-800 hover:bg-blue-50"
            onClick={addDestination}
            disabled={!pickerValue || availableOptions.length === 0}
          >
            Thêm vào tour
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Đang lưu..." : "Lưu tour nháp"}
      </Button>
    </form>
  );
}
