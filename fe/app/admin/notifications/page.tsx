"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Edit, Trash2, Bell, MapPin } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { DataTable, Column, Action } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { mockNotifications, type Notification } from "@/lib/admin-data";

const notificationTypeLabels: Record<Notification["type"], { label: string; color: string }> = {
  info: { label: "Thông tin", color: "bg-blue-50 text-blue-700" },
  warning: { label: "Cảnh báo", color: "bg-amber-50 text-amber-700" },
  alert: { label: "Khẩn cấp", color: "bg-red-50 text-red-700" },
  promotion: { label: "Khuyến mãi", color: "bg-emerald-50 text-emerald-700" },
};

const statusLabels: Record<Notification["status"], { label: string; type: "success" | "warning" | "error" | "pending" }> = {
  active: { label: "Đang hiển thị", type: "success" },
  inactive: { label: "Tạm ẩn", type: "warning" },
  expired: { label: "Hết hạn", type: "error" },
};

export default function AdminNotificationsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const filteredData = useMemo(() => {
    return mockNotifications.filter((notif) => {
      const matchesSearch =
        !search ||
        notif.title.toLowerCase().includes(search.toLowerCase()) ||
        notif.content.toLowerCase().includes(search.toLowerCase());
      const matchesType = !type || notif.type === type;
      const matchesStatus = !status || notif.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, type, status]);

  const columns: Column<Notification>[] = [
    {
      key: "title",
      header: "Tiêu đề",
      width: "220px",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.title}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{row.content}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Loại",
      width: "120px",
      render: (row) => {
        const typeConfig = notificationTypeLabels[row.type];
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
        );
      },
    },
    {
      key: "destination",
      header: "Địa điểm",
      width: "150px",
      render: (row) =>
        row.destination_name ? (
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="size-3.5" aria-hidden="true" />
            <span className="text-sm">{row.destination_name}</span>
          </div>
        ) : (
          <span className="text-slate-400">Tất cả</span>
        ),
    },
    {
      key: "date_range",
      header: "Thời gian",
      width: "150px",
      render: (row) => (
        <div className="text-sm text-slate-600">
          <p>{new Date(row.start_date).toLocaleDateString("vi-VN")}</p>
          <p className="text-xs text-slate-400">- {new Date(row.end_date).toLocaleDateString("vi-VN")}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "130px",
      render: (row) => {
        const statusConfig = statusLabels[row.status];
        return <StatusBadge status={statusConfig.type} label={statusConfig.label} />;
      },
    },
  ];

  const actions: Action<Notification>[] = [
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
            Quản lý thông báo
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Tạo, cập nhật và quản lý thông báo liên quan đến điểm du lịch.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Thêm thông báo
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder="Tìm kiếm thông báo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { label: "Tất cả loại", value: "" },
              { label: "Thông tin", value: "info" },
              { label: "Cảnh báo", value: "warning" },
              { label: "Khẩn cấp", value: "alert" },
              { label: "Khuyến mãi", value: "promotion" },
            ]}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: "Tất cả trạng thái", value: "" },
              { label: "Đang hiển thị", value: "active" },
              { label: "Tạm ẩn", value: "inactive" },
              { label: "Hết hạn", value: "expired" },
            ]}
          />
        </div>
      </Card>

      {filteredData.length === 0 ? (
        <EmptyState
          title="Không tìm thấy thông báo"
          description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."
          icon={Bell}
          action={{ label: "Thêm thông báo" }}
        />
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          actions={actions}
          keyExtractor={(row) => row.id}
          emptyMessage="Không có thông báo nào"
        />
      )}
    </div>
  );
}
