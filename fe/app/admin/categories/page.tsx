"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, FolderTree } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { DataTable, Column, Action } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { mockCategories, type DestinationCategory } from "@/lib/admin-data";

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");

  const filteredData = mockCategories.filter((cat) => {
    if (!search) return true;
    return (
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const columns: Column<DestinationCategory>[] = [
    {
      key: "name",
      header: "Tên loại hình",
      width: "180px",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-lg"
            style={{ backgroundColor: row.color ? `${row.color}20` : "#f3f4f5" }}
          >
            <div
              className="flex size-full items-center justify-center rounded-lg text-xs font-bold"
              style={{ color: row.color || "#6b7280" }}
            >
              {row.name.charAt(0)}
            </div>
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <div
              className="mt-0.5 h-1.5 w-12 rounded-full"
              style={{ backgroundColor: row.color || "#e5e7eb" }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Mô tả",
      render: (row) => <p className="text-slate-600">{row.description}</p>,
    },
    {
      key: "destinations_count",
      header: "Số điểm",
      width: "100px",
      render: (row) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {row.destinations_count}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Cập nhật",
      width: "130px",
      render: (row) => (
        <span className="text-slate-500">
          {new Date(row.updated_at).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
  ];

  const actions: Action<DestinationCategory>[] = [
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
            Quản lý loại hình du lịch
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Quản lý danh mục loại hình cho điểm du lịch.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Thêm loại hình
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder="Tìm kiếm loại hình..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <FolderTree className="mr-1.5 size-4" aria-hidden="true" />
            {filteredData.length} loại hình
          </div>
        </div>
      </Card>

      {filteredData.length === 0 ? (
        <EmptyState
          title="Không tìm thấy loại hình"
          description="Thử thay đổi từ khóa tìm kiếm."
          icon={FolderTree}
          action={{ label: "Thêm loại hình" }}
        />
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          actions={actions}
          keyExtractor={(row) => row.id}
          emptyMessage="Không có loại hình nào"
        />
      )}
    </div>
  );
}
