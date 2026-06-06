"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit, Store, Trash2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { DataTable, Column, Action } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  createAdminService,
  deleteAdminService,
  getAdminProvinces,
  getAdminServices,
  updateAdminService,
  type AdminProvince,
  type AdminService,
  type AdminServicePayload,
} from "@/lib/api/admin";

type ServiceFormValues = {
  address: string;
  description: string;
  latitude: string;
  longitude: string;
  name: string;
  phone: string;
  provinceId: string;
  rating: string;
  type: AdminService["type"];
};

const serviceTypeLabels: Record<AdminService["type"], string> = {
  hotel: "Khách sạn",
  restaurant: "Nhà hàng",
  parking: "Bãi đỗ xe",
  medical: "Y tế",
  gas_station: "Trạm xăng",
  other: "Khác",
};

function toServiceFormValues(service?: AdminService | null): ServiceFormValues {
  return {
    address: service?.address || "",
    description: service?.description || "",
    latitude: service?.location?.lat?.toString() || "",
    longitude: service?.location?.lng?.toString() || "",
    name: service?.name || "",
    phone: service?.phone || "",
    provinceId: service?.provinceId || "",
    rating: service?.rating?.toString() || "0",
    type: service?.type || "hotel",
  };
}

function toNumberOrNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : null;
}

const serviceTypeColors: Record<AdminService["type"], { bg: string; text: string }> = {
  hotel: { bg: "bg-brand-surface-low", text: "text-brand-secondary" },
  restaurant: { bg: "bg-orange-50", text: "text-orange-700" },
  parking: { bg: "bg-slate-50", text: "text-slate-700" },
  medical: { bg: "bg-red-50", text: "text-red-700" },
  gas_station: { bg: "bg-amber-50", text: "text-amber-700" },
  other: { bg: "bg-teal-50", text: "text-teal-700" },
};

export default function AdminServicesPage() {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [editingItem, setEditingItem] = useState<AdminService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<AdminService[]>([]);
  const [provinces, setProvinces] = useState<AdminProvince[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ServiceFormValues>({
    defaultValues: toServiceFormValues(),
  });
  const selectedProvinceId = watch("provinceId");

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);
      const [provinceItems, serviceItems] = await Promise.all([
        getAdminProvinces(),
        getAdminServices(),
      ]);
      setProvinces(provinceItems);
      setServices(serviceItems);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải dịch vụ hỗ trợ.");
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedProvinceId || editingItem) return;
    const existingInProvince = services.find((service) => service.provinceId === selectedProvinceId && service.location);
    if (!existingInProvince?.location) return;
    setValue("latitude", existingInProvince.location.lat.toString());
    setValue("longitude", existingInProvince.location.lng.toString());
  }, [editingItem, selectedProvinceId, services, setValue]);

  const serviceTypes = useMemo(() => {
    const types = [...new Set(services.map((s) => s.type))];
    return types.map((t) => ({ label: serviceTypeLabels[t], value: t }));
  }, [services]);

  const filteredData = useMemo(() => {
    return services.filter((svc) => {
      const matchesSearch =
        !search ||
        svc.name.toLowerCase().includes(search.toLowerCase()) ||
        (svc.address || "").toLowerCase().includes(search.toLowerCase());
      const matchesProvince = !province || svc.provinceId === province;
      const matchesType = !serviceType || svc.type === serviceType;
      return matchesSearch && matchesProvince && matchesType;
    });
  }, [services, search, province, serviceType]);

  const columns: Column<AdminService>[] = [
    {
      key: "name",
      header: "Tên dịch vụ",
      width: "220px",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{row.address}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Loại dịch vụ",
      width: "130px",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${serviceTypeColors[row.type].bg} ${serviceTypeColors[row.type].text}`}
        >
          {serviceTypeLabels[row.type]}
        </span>
      ),
    },
    {
      key: "provinceName",
      header: "Tỉnh/Thành",
      width: "120px",
    },
    {
      key: "phone",
      header: "Số điện thoại",
      width: "130px",
      render: (row) => <span className="text-slate-600">{row.phone || "-"}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "110px",
      render: () => {
        return <StatusBadge status="success" label="Hoạt động" />;
      },
    },
  ];

  const actions: Action<AdminService>[] = [
    {
      label: "Sửa",
      icon: Edit,
      variant: "ghost",
      onClick: (row) => {
        setEditingItem(row);
        reset(toServiceFormValues(row));
      },
    },
    {
      label: "Xóa",
      icon: Trash2,
      variant: "destructive",
      onClick: async (row) => {
        if (!window.confirm(`Xóa dịch vụ "${row.name}"?`)) return;
        try {
          await deleteAdminService(row.id);
          if (editingItem?.id === row.id) {
            setEditingItem(null);
            reset(toServiceFormValues());
          }
          await loadData();
        } catch (deleteError) {
          setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa dịch vụ.");
        }
      },
    },
  ];

  function startCreate() {
    setEditingItem(null);
    reset(toServiceFormValues());
  }

  async function onSubmit(values: ServiceFormValues) {
    const payload: AdminServicePayload = {
      address: values.address.trim() || null,
      description: values.description.trim() || null,
      location: {
        lat: Number(values.latitude),
        lng: Number(values.longitude),
      },
      name: values.name.trim(),
      phone: values.phone.trim() || null,
      provinceId: values.provinceId,
      rating: toNumberOrNull(values.rating),
      type: values.type,
    };

    try {
      setIsSaving(true);
      setError(null);
      if (editingItem) {
        await updateAdminService(editingItem.id, payload);
      } else {
        await createAdminService(payload);
      }
      setEditingItem(null);
      reset(toServiceFormValues());
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu dịch vụ.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Quản lý dịch vụ hỗ trợ
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Quản lý khách sạn, nhà hàng, bãi đỗ xe, y tế và tiện ích liên quan.
          </p>
        </div>
        <Button type="button" onClick={startCreate}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Thêm dịch vụ
        </Button>
      </div>

      {error ? (
        <Card className="border-brand-danger/25 bg-red-50 p-4 text-sm text-brand-danger">
          {error}
        </Card>
      ) : null}

      <Card className="p-4">
        <form className="grid gap-4 lg:grid-cols-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Tên dịch vụ</span>
            <Input
              placeholder="VD: Bãi đỗ xe An Hội"
              aria-invalid={Boolean(errors.name)}
              {...register("name", {
                required: "Vui lòng nhập tên dịch vụ.",
                minLength: { value: 2, message: "Tên cần ít nhất 2 ký tự." },
                maxLength: { value: 150, message: "Tên không quá 150 ký tự." },
              })}
            />
            {errors.name?.message ? <span className="text-xs text-brand-danger">{errors.name.message}</span> : null}
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Tỉnh/Thành</span>
            <Select
              {...register("provinceId", { required: "Vui lòng chọn tỉnh/thành." })}
              options={[
                { label: "Chọn tỉnh/thành", value: "" },
                ...provinces.map((item) => ({ label: item.name, value: item.id })),
              ]}
            />
            {errors.provinceId?.message ? <span className="text-xs text-brand-danger">{errors.provinceId.message}</span> : null}
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Loại dịch vụ</span>
            <Select
              {...register("type")}
              options={Object.entries(serviceTypeLabels).map(([value, label]) => ({ label, value }))}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Số điện thoại</span>
            <Input placeholder="0235..." {...register("phone", { maxLength: { value: 30, message: "Số điện thoại không quá 30 ký tự." } })} />
            {errors.phone?.message ? <span className="text-xs text-brand-danger">{errors.phone.message}</span> : null}
          </label>
          <label className="grid gap-1.5 lg:col-span-2">
            <span className="text-xs font-bold uppercase text-slate-500">Địa chỉ</span>
            <Input placeholder="Địa chỉ dịch vụ" {...register("address")} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Vĩ độ</span>
            <Input
              inputMode="decimal"
              placeholder="16.4668"
              aria-invalid={Boolean(errors.latitude)}
              {...register("latitude", {
                required: "Nhập vĩ độ.",
                validate: (value) => {
                  const numberValue = Number(value);
                  return (Number.isFinite(numberValue) && numberValue >= -90 && numberValue <= 90) || "Vĩ độ phải từ -90 đến 90.";
                },
              })}
            />
            {errors.latitude?.message ? <span className="text-xs text-brand-danger">{errors.latitude.message}</span> : null}
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Kinh độ</span>
            <Input
              inputMode="decimal"
              placeholder="107.5900"
              aria-invalid={Boolean(errors.longitude)}
              {...register("longitude", {
                required: "Nhập kinh độ.",
                validate: (value) => {
                  const numberValue = Number(value);
                  return (Number.isFinite(numberValue) && numberValue >= -180 && numberValue <= 180) || "Kinh độ phải từ -180 đến 180.";
                },
              })}
            />
            {errors.longitude?.message ? <span className="text-xs text-brand-danger">{errors.longitude.message}</span> : null}
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Rating</span>
            <Input
              inputMode="decimal"
              placeholder="4.5"
              {...register("rating", {
                validate: (value) => {
                  if (!value.trim()) return true;
                  const numberValue = Number(value);
                  return (Number.isFinite(numberValue) && numberValue >= 0 && numberValue <= 5) || "Rating phải từ 0 đến 5.";
                },
              })}
            />
            {errors.rating?.message ? <span className="text-xs text-brand-danger">{errors.rating.message}</span> : null}
          </label>
          <label className="grid gap-1.5 lg:col-span-3">
            <span className="text-xs font-bold uppercase text-slate-500">Mô tả</span>
            <Input placeholder="Vai trò của dịch vụ trong tuyến tham quan" {...register("description")} />
          </label>
          <div className="flex items-end gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Đang lưu…" : editingItem ? "Cập nhật" : "Tạo mới"}
            </Button>
            {editingItem ? (
              <Button type="button" variant="outline" onClick={startCreate}>
                Hủy
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder="Tìm kiếm dịch vụ…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            options={[
              { label: "Tất cả tỉnh/thành", value: "" },
              ...provinces.map((p) => ({ label: p.name, value: p.id })),
            ]}
          />
          <Select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            options={[{ label: "Tất cả loại dịch vụ", value: "" }, ...serviceTypes]}
          />
          <div className="flex items-center text-sm text-slate-500">
            <Store className="mr-1.5 size-4" aria-hidden="true" />
            {filteredData.length} kết quả
          </div>
        </div>
      </Card>

      {filteredData.length === 0 ? (
        <EmptyState
          title="Không tìm thấy dịch vụ"
          description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."
          icon={Store}
          action={{ label: "Thêm dịch vụ" }}
        />
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          actions={actions}
          keyExtractor={(row) => row.id}
          emptyMessage="Không có dịch vụ nào"
          loading={isLoading}
        />
      )}
    </div>
  );
}
