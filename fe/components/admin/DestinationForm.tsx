"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { REGION_PROVINCES } from "@/lib/constants";
import { mockCategories } from "@/lib/admin-data";

type DestinationFormData = {
  name: string;
  province: string;
  category: string;
  address: string;
  latitude: string;
  longitude: string;
  ticket_price: string;
  open_time: string;
  close_time: string;
  description: string;
};

type DestinationFormProps = {
  initialData?: Partial<DestinationFormData>;
  isEditing?: boolean;
};

export function DestinationForm({ initialData, isEditing = false }: DestinationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DestinationFormData>({
    name: initialData?.name || "",
    province: initialData?.province || "",
    category: initialData?.category || "",
    address: initialData?.address || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",
    ticket_price: initialData?.ticket_price || "",
    open_time: initialData?.open_time || "07:00",
    close_time: initialData?.close_time || "18:00",
    description: initialData?.description || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DestinationFormData, string>>>({});

  const handleChange = (field: keyof DestinationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DestinationFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên điểm du lịch là bắt buộc";
    }
    if (!formData.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành";
    }
    if (!formData.category) {
      newErrors.category = "Vui lòng chọn loại hình";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }
    if (!formData.ticket_price || isNaN(Number(formData.ticket_price))) {
      newErrors.ticket_price = "Giá vé phải là số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    router.push("/admin/destinations");
  };

  const categoryOptions = mockCategories.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
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
              ? "Cập nhật thông tin điểm du lịch trong hệ thống."
              : "Tạo mới một điểm du lịch trong hệ thống."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Thông tin cơ bản</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Tên điểm du lịch <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder="Nhập tên điểm du lịch"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="province" className="mb-1.5 block text-sm font-medium text-slate-700">
                Tỉnh/Thành <span className="text-red-500">*</span>
              </label>
              <Select
                id="province"
                value={formData.province}
                onChange={(e) => handleChange("province", e.target.value)}
                options={[{ label: "Chọn tỉnh/thành", value: "" }, ...REGION_PROVINCES.map((p) => ({ label: p, value: p }))]}
                className={errors.province ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.province && <p className="mt-1 text-xs text-red-500">{errors.province}</p>}
            </div>

            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
                Loại hình du lịch <span className="text-red-500">*</span>
              </label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                options={[{ label: "Chọn loại hình", value: "" }, ...categoryOptions]}
                className={errors.category ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-slate-700">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <Input
                id="address"
                placeholder="Nhập địa chỉ đầy đủ"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
                Mô tả
              </label>
              <textarea
                id="description"
                placeholder="Nhập mô tả ngắn về điểm du lịch"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Thông tin bổ sung</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ticket_price" className="mb-1.5 block text-sm font-medium text-slate-700">
                Giá vé (VNĐ) <span className="text-red-500">*</span>
              </label>
              <Input
                id="ticket_price"
                type="number"
                placeholder="0 = Miễn phí"
                value={formData.ticket_price}
                onChange={(e) => handleChange("ticket_price", e.target.value)}
                className={errors.ticket_price ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}
              />
              {errors.ticket_price && <p className="mt-1 text-xs text-red-500">{errors.ticket_price}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="open_time" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Giờ mở cửa
                </label>
                <Input
                  id="open_time"
                  type="time"
                  value={formData.open_time}
                  onChange={(e) => handleChange("open_time", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="close_time" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Giờ đóng cửa
                </label>
                <Input
                  id="close_time"
                  type="time"
                  value={formData.close_time}
                  onChange={(e) => handleChange("close_time", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="latitude" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Vĩ độ (Latitude)
                </label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="16.0544"
                  value={formData.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="longitude" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Kinh độ (Longitude)
                </label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="108.2139"
                  value={formData.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/destinations">Hủy</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              "Đang lưu..."
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
