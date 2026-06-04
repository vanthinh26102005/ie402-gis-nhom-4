"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Edit, Store, Trash2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { DataTable, Column, Action } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { getAdminServices, type AdminService } from "@/lib/api/admin";
import { REGION_PROVINCES } from "@/lib/constants";

const serviceTypeLabels: Record<AdminService["type"], string> = {
  hotel: "Khách sạn",
  restaurant: "Nhà hàng",
  parking: "Bãi đỗ xe",
  medical: "Y tế",
  gas_station: "Trạm xăng",
  other: "Khác",
};

const serviceTypeColors: Record<AdminService["type"], { bg: string; text: string }> = {
  hotel: { bg: "bg-blue-50", text: "text-blue-700" },
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
  const [services, setServices] = useState<AdminService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminServices()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setIsLoading(false));
  }, []);

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
      const matchesProvince = !province || svc.provinceName === province;
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
      render: (row) => {
        return <StatusBadge status="success" label="Hoạt động" />;
      },
    },
  ];

  const actions: Action<AdminService>[] = [
    {
      label: "Sửa",
      icon: Edit,
      variant: "ghost",
    },
    {
      label: "Xóa",
      icon: Trash2,
      variant: "destructive",
    },
  ];

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
        <Button>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Thêm dịch vụ
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder="Tìm kiếm dịch vụ..."
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
              ...REGION_PROVINCES.map((p) => ({ label: p, value: p })),
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
