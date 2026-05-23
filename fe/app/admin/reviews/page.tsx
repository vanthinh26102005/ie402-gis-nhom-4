"use client";

import { useState, useMemo } from "react";
import { Search, Eye, MapPinned, MessageSquare } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { DataTable, Column, Action } from "@/components/admin/DataTable";
import { StatusBadge, RatingBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { mockReviews, type Review } from "@/lib/admin-data";

const statusLabels = {
  approved: { label: "Đã duyệt", type: "success" as const },
  pending: { label: "Chờ duyệt", type: "warning" as const },
  hidden: { label: "Đã ẩn", type: "pending" as const },
  rejected: { label: "Từ chối", type: "error" as const },
} as const;

export default function AdminReviewsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const pendingCount = mockReviews.filter((r) => r.status === "pending").length;

  const filteredData = useMemo(() => {
    return mockReviews.filter((review) => {
      const matchesSearch =
        !search ||
        review.user_name.toLowerCase().includes(search.toLowerCase()) ||
        review.destination_name.toLowerCase().includes(search.toLowerCase()) ||
        review.content.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || review.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const columns: Column<Review>[] = [
    {
      key: "user",
      header: "Người đánh giá",
      width: "160px",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.user_name}</p>
          <p className="mt-0.5 text-xs text-slate-500">ID: {row.user_id}</p>
        </div>
      ),
    },
    {
      key: "destination",
      header: "Địa điểm",
      width: "160px",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <MapPinned className="size-3.5 text-slate-400" aria-hidden="true" />
          <span className="text-slate-700">{row.destination_name}</span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Điểm",
      width: "80px",
      render: (row) => <RatingBadge score={row.rating} />,
    },
    {
      key: "content",
      header: "Nội dung",
      render: (row) => (
        <p className="line-clamp-2 max-w-md text-sm text-slate-600">{row.content}</p>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "110px",
      render: (row) => {
        const statusConfig = statusLabels[row.status];
        return <StatusBadge status={statusConfig.type} label={statusConfig.label} />;
      },
    },
    {
      key: "created_at",
      header: "Ngày",
      width: "100px",
      render: (row) => (
        <span className="text-slate-500">
          {new Date(row.created_at).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
  ];

  const actions: Action<Review>[] = [
    {
      label: "Kiểm duyệt",
      icon: Eye,
      href: (row) => `/admin/reviews/${row.id}/moderate`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Quản lý đánh giá
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Theo dõi, lọc và kiểm duyệt đánh giá của người dùng.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 border border-amber-200">
            <MessageSquare className="size-4" aria-hidden="true" />
            {pendingCount} đánh giá chờ kiểm duyệt
          </div>
        )}
      </div>

      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder="Tìm kiếm đánh giá..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: "Tất cả trạng thái", value: "" },
              { label: "Chờ duyệt", value: "pending" },
              { label: "Đã duyệt", value: "approved" },
              { label: "Đã ẩn", value: "hidden" },
              { label: "Từ chối", value: "rejected" },
            ]}
          />
          <div className="flex items-center text-sm text-slate-500">
            <MessageSquare className="mr-1.5 size-4" aria-hidden="true" />
            {filteredData.length} đánh giá
          </div>
        </div>
      </Card>

      {filteredData.length === 0 ? (
        <EmptyState
          title="Không tìm thấy đánh giá"
          description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."
          icon={MessageSquare}
        />
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          actions={actions}
          keyExtractor={(row) => row.id}
          emptyMessage="Không có đánh giá nào"
        />
      )}
    </div>
  );
}
