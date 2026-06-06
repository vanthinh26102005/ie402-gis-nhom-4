"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import type {
  AdminCategory,
  AdminDestination,
  AdminDestinationPayload,
  AdminProvince,
} from "@/lib/api/admin";
import { cn } from "@/lib/utils";

type DestinationFormValues = {
  address: string;
  categoryId: string;
  closeTime: string;
  description: string;
  latitude: string;
  longitude: string;
  name: string;
  openTime: string;
  provinceId: string;
  rating: string;
  ticketPrice: string;
};

type DestinationFormProps = {
  categories: AdminCategory[];
  initialData?: AdminDestination | null;
  isEditing?: boolean;
  isSubmitting?: boolean;
  onSubmit: (payload: AdminDestinationPayload) => Promise<void>;
  provinces: AdminProvince[];
  submitError?: string | null;
};

function normalizeTime(value?: string | null) {
  return value ? String(value).slice(0, 5) : "";
}

function buildDefaultValues(initialData?: AdminDestination | null): DestinationFormValues {
  return {
    address: initialData?.address || "",
    categoryId: initialData?.categoryId || "",
    closeTime: normalizeTime(initialData?.closeTime) || "18:00",
    description: initialData?.description || "",
    latitude: initialData?.location?.lat?.toString() || "",
    longitude: initialData?.location?.lng?.toString() || "",
    name: initialData?.name || "",
    openTime: normalizeTime(initialData?.openTime) || "07:00",
    provinceId: initialData?.provinceId || "",
    rating: initialData?.rating?.toString() || "0",
    ticketPrice: initialData?.ticketPrice?.toString() || "0",
  };
}

function toPayload(values: DestinationFormValues): AdminDestinationPayload {
  return {
    address: values.address.trim(),
    categoryId: values.categoryId,
    closeTime: values.closeTime || null,
    description: values.description.trim() || null,
    location: {
      lat: Number(values.latitude),
      lng: Number(values.longitude),
    },
    name: values.name.trim(),
    openTime: values.openTime || null,
    provinceId: values.provinceId,
    rating: Number(values.rating),
    ticketPrice: Number(values.ticketPrice),
  };
}

function isFiniteStringNumber(value: string) {
  return value.trim() !== "" && Number.isFinite(Number(value));
}

export function DestinationForm({
  categories,
  initialData = null,
  isEditing = false,
  isSubmitting = false,
  onSubmit,
  provinces,
  submitError = null,
}: DestinationFormProps) {
  const {
    formState: { errors, isSubmitting: isFormSubmitting },
    getValues,
    handleSubmit,
    register,
  } = useForm<DestinationFormValues>({
    defaultValues: buildDefaultValues(initialData),
    mode: "onBlur",
  });

  const provinceOptions = useMemo(
    () => [
      { label: "Chọn tỉnh/thành", value: "" },
      ...provinces.map((province) => ({
        label: province.name,
        value: province.id,
      })),
    ],
    [provinces],
  );

  const categoryOptions = useMemo(
    () => [
      { label: "Chọn loại hình", value: "" },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ],
    [categories],
  );

  const submitDisabled = isSubmitting || isFormSubmitting;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/destinations">
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {isEditing ? "Sửa điểm du lịch" : "Thêm điểm du lịch"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isEditing
              ? "Cập nhật dữ liệu điểm du lịch đang lưu trong PostgreSQL/PostGIS."
              : "Tạo mới một điểm du lịch và tọa độ bản đồ trong hệ thống."}
          </p>
        </div>
      </div>

      {submitError ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit((values) => onSubmit(toPayload(values)))} className="space-y-6" noValidate>
        <Card className="rounded-lg p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Thông tin cơ bản</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên điểm du lịch" error={errors.name?.message} required>
              <Input
                {...register("name", {
                  required: "Tên điểm du lịch là bắt buộc.",
                  setValueAs: (value) => String(value || "").trimStart(),
                  minLength: { value: 2, message: "Tên điểm du lịch phải có ít nhất 2 ký tự." },
                  maxLength: { value: 150, message: "Tên điểm du lịch tối đa 150 ký tự." },
                })}
                placeholder="Nhập tên điểm du lịch"
                aria-invalid={Boolean(errors.name)}
                className={inputErrorClass(errors.name?.message)}
              />
            </Field>

            <Field label="Tỉnh/Thành" error={errors.provinceId?.message} required>
              <Select
                {...register("provinceId", {
                  required: "Vui lòng chọn tỉnh/thành.",
                })}
                options={provinceOptions}
                aria-invalid={Boolean(errors.provinceId)}
                className={inputErrorClass(errors.provinceId?.message)}
              />
            </Field>

            <Field label="Loại hình du lịch" error={errors.categoryId?.message} required>
              <Select
                {...register("categoryId", {
                  required: "Vui lòng chọn loại hình.",
                })}
                options={categoryOptions}
                aria-invalid={Boolean(errors.categoryId)}
                className={inputErrorClass(errors.categoryId?.message)}
              />
            </Field>

            <Field className="sm:col-span-2" label="Địa chỉ" error={errors.address?.message} required>
              <Input
                {...register("address", {
                  required: "Địa chỉ là bắt buộc.",
                  setValueAs: (value) => String(value || "").trimStart(),
                  maxLength: { value: 300, message: "Địa chỉ tối đa 300 ký tự." },
                })}
                placeholder="Nhập địa chỉ đầy đủ"
                aria-invalid={Boolean(errors.address)}
                className={inputErrorClass(errors.address?.message)}
              />
            </Field>

            <Field className="sm:col-span-2" label="Mô tả" error={errors.description?.message}>
              <Textarea
                {...register("description", {
                  maxLength: { value: 1000, message: "Mô tả tối đa 1000 ký tự." },
                })}
                placeholder="Nhập mô tả ngắn về điểm du lịch"
                rows={4}
                aria-invalid={Boolean(errors.description)}
                className={inputErrorClass(errors.description?.message)}
              />
            </Field>
          </div>
        </Card>

        <Card className="rounded-lg p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Thông tin vận hành</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Giá vé (VNĐ)" error={errors.ticketPrice?.message} required>
              <Input
                {...register("ticketPrice", {
                  required: "Giá vé là bắt buộc.",
                  validate: (value) => {
                    const parsed = Number(value);
                    if (!isFiniteStringNumber(value)) return "Giá vé phải là số.";
                    if (parsed < 0) return "Giá vé phải là số không âm.";
                    return true;
                  },
                })}
                type="number"
                min={0}
                placeholder="0 = Miễn phí"
                aria-invalid={Boolean(errors.ticketPrice)}
                className={inputErrorClass(errors.ticketPrice?.message)}
              />
            </Field>

            <Field label="Đánh giá mặc định" error={errors.rating?.message}>
              <Input
                {...register("rating", {
                  validate: (value) => {
                    const parsed = Number(value);
                    if (!isFiniteStringNumber(value)) return "Đánh giá phải là số.";
                    if (parsed < 0 || parsed > 5) return "Đánh giá phải nằm trong khoảng 0 đến 5.";
                    return true;
                  },
                })}
                type="number"
                min={0}
                max={5}
                step="0.1"
                aria-invalid={Boolean(errors.rating)}
                className={inputErrorClass(errors.rating?.message)}
              />
            </Field>

            <Field label="Giờ mở cửa" error={errors.openTime?.message}>
              <Input
                {...register("openTime")}
                type="time"
                aria-invalid={Boolean(errors.openTime)}
                className={inputErrorClass(errors.openTime?.message)}
              />
            </Field>

            <Field label="Giờ đóng cửa" error={errors.closeTime?.message}>
              <Input
                {...register("closeTime", {
                  validate: (value) => {
                    const openTime = getValues("openTime");
                    if (!openTime || !value) return true;
                    return value > openTime || "Giờ đóng cửa phải sau giờ mở cửa.";
                  },
                })}
                type="time"
                aria-invalid={Boolean(errors.closeTime)}
                className={inputErrorClass(errors.closeTime?.message)}
              />
            </Field>

            <Field label="Vĩ độ (Latitude)" error={errors.latitude?.message} required>
              <Input
                {...register("latitude", {
                  required: "Vĩ độ là bắt buộc.",
                  validate: (value) => {
                    const parsed = Number(value);
                    if (!isFiniteStringNumber(value)) return "Vĩ độ phải là số.";
                    if (parsed < -90 || parsed > 90) return "Vĩ độ phải nằm trong khoảng -90 đến 90.";
                    return true;
                  },
                })}
                type="number"
                step="any"
                placeholder="16.0544"
                aria-invalid={Boolean(errors.latitude)}
                className={inputErrorClass(errors.latitude?.message)}
              />
            </Field>

            <Field label="Kinh độ (Longitude)" error={errors.longitude?.message} required>
              <Input
                {...register("longitude", {
                  required: "Kinh độ là bắt buộc.",
                  validate: (value) => {
                    const parsed = Number(value);
                    if (!isFiniteStringNumber(value)) return "Kinh độ phải là số.";
                    if (parsed < -180 || parsed > 180) return "Kinh độ phải nằm trong khoảng -180 đến 180.";
                    return true;
                  },
                })}
                type="number"
                step="any"
                placeholder="108.2139"
                aria-invalid={Boolean(errors.longitude)}
                className={inputErrorClass(errors.longitude?.message)}
              />
            </Field>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/destinations">Hủy</Link>
          </Button>
          <Button type="submit" disabled={submitDisabled}>
            {submitDisabled ? (
              "Đang lưu…"
            ) : (
              <>
                <Save className="mr-2 size-4" aria-hidden="true" />
                {isEditing ? "Cập nhật" : "Lưu điểm du lịch"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  children,
  className,
  error,
  label,
  required = false,
}: {
  children: ReactNode;
  className?: string;
  error?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      {children}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function inputErrorClass(error?: string) {
  return error ? "border-brand-danger focus:border-brand-danger focus:ring-brand-danger/10" : "";
}
