"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Edit, MapPinned } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { DataTable, Column, Action } from "@/components/admin/DataTable";
import { StatusBadge, CategoryBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { getAdminDestinations, type AdminDestination } from "@/lib/api/admin";
import { REGION_PROVINCES } from "@/lib/constants";

export default function AdminDestinationsPage() {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [category, setCategory] = useState("");
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(destinations.map((d) => d.categoryName).filter((value): value is string => Boolean(value)))];
    return cats.map((c) => ({ label: c, value: c }));
  }, [destinations]);

  const filteredData = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch =
        !search ||
        dest.name.toLowerCase().includes(search.toLowerCase()) ||
        (dest.address || "").toLowerCase().includes(search.toLowerCase());
      const matchesProvince = !province || dest.provinceName === province;
      const matchesCategory = !category || dest.categoryName === category;
      return matchesSearch && matchesProvince && matchesCategory;
    });
  }, [destinations, search, province, category]);

  const columns: Column<AdminDestination>[] = [
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
      key: "provinceName",
      header: "Tỉnh/Thành",
      width: "120px",
    },
    {
      key: "categoryName",
      header: "Loại hình",
      width: "140px",
      render: (row) => <CategoryBadge label={row.categoryName || "Khác"} />,
    },
    {
      key: "ticketPrice",
      header: "Giá vé",
      width: "100px",
      render: (row) => (
        <span className="text-slate-700">
          {row.ticketPrice === 0 ? "Miễn phí" : `${Number(row.ticketPrice || 0).toLocaleString()}đ`}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Giờ mở cửa",
      width: "120px",
      render: (row) => (
        <span className="text-slate-600">
          {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString("vi-VN") : "-"}
        </span>
      ),
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

  const actions: Action<AdminDestination>[] = [
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
              placeholder="Tìm kiếm điểm du lịch…"
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
          loading={isLoading}
        />
      )}
    </div>
  );
}
