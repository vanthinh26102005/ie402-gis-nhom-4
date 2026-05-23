"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Edit, MapPinned } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { DataTable, Column, Action } from "@/components/admin/DataTable";
import { StatusBadge, CategoryBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { mockDestinations, type TouristDestination } from "@/lib/admin-data";
import { REGION_PROVINCES } from "@/lib/constants";

export default function AdminDestinationsPage() {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(() => {
    const cats = [...new Set(mockDestinations.map((d) => d.category))];
    return cats.map((c) => ({ label: c, value: c }));
  }, []);

  const filteredData = useMemo(() => {
    return mockDestinations.filter((dest) => {
      const matchesSearch =
        !search ||
        dest.name.toLowerCase().includes(search.toLowerCase()) ||
        dest.address.toLowerCase().includes(search.toLowerCase());
      const matchesProvince = !province || dest.province === province;
      const matchesCategory = !category || dest.category === category;
      return matchesSearch && matchesProvince && matchesCategory;
    });
  }, [search, province, category]);

  const columns: Column<TouristDestination>[] = [
    {
      key: "name",
      header: "Tên điểm du lịch",
      width: "220px",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{row.address}</p>
        </div>
      ),
    },
    {
      key: "province",
      header: "Tỉnh/Thành",
      width: "120px",
    },
    {
      key: "category",
      header: "Loại hình",
      width: "140px",
      render: (row) => <CategoryBadge label={row.category} />,
    },
    {
      key: "ticket_price",
      header: "Giá vé",
      width: "100px",
      render: (row) => (
        <span className="text-slate-700">
          {row.ticket_price === 0 ? "Miễn phí" : `${row.ticket_price.toLocaleString()}đ`}
        </span>
      ),
    },
    {
      key: "open_time",
      header: "Giờ mở cửa",
      width: "120px",
      render: (row) => (
        <span className="text-slate-600">
          {row.open_time} - {row.close_time}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "110px",
      render: (row) => {
        const statusMap = {
          active: { label: "Hoạt động", type: "success" as const },
          inactive: { label: "Tạm dừng", type: "error" as const },
          pending: { label: "Chờ duyệt", type: "warning" as const },
        };
        const status = statusMap[row.status];
        return <StatusBadge status={status.type} label={status.label} />;
      },
    },
  ];

  const actions: Action<TouristDestination>[] = [
    {
      label: "Sửa",
      icon: Edit,
      href: (row) => `/admin/destinations/${row.id}/edit`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Quản lý điểm du lịch
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Danh sách và thao tác dữ liệu điểm du lịch trong hệ thống.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/destinations/new">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Thêm điểm du lịch
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder="Tìm kiếm điểm du lịch..."
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[{ label: "Tất cả loại hình", value: "" }, ...categories]}
          />
          <div className="flex items-center text-sm text-slate-500">
            <MapPinned className="mr-1.5 size-4" aria-hidden="true" />
            {filteredData.length} kết quả
          </div>
        </div>
      </Card>

      {filteredData.length === 0 ? (
        <EmptyState
          title="Không tìm thấy điểm du lịch"
          description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."
          icon={MapPinned}
          action={{
            label: "Thêm điểm du lịch",
            href: "/admin/destinations/new",
          }}
        />
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          actions={actions}
          keyExtractor={(row) => row.id}
          emptyMessage="Không có điểm du lịch nào"
        />
      )}
    </div>
  );
}
