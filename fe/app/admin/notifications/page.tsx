"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Bell, Edit, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { DataTable, type Action, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import {
  createAdminNotification,
  deleteAdminNotification,
  getAdminDestinations,
  getAdminNotifications,
  updateAdminNotification,
  type AdminDestination,
  type AdminNotification,
  type AdminNotificationPayload,
} from "@/lib/api/admin";

type NotificationFormValues = {
  content: string;
  destinationId: string;
  status: AdminNotification["status"];
  title: string;
  type: AdminNotification["type"];
};

const notificationTypeLabels: Record<AdminNotification["type"], { label: string; color: string }> = {
  event: { label: "Sự kiện", color: "bg-brand-gis-soft text-brand-gis" },
  maintenance: { label: "Bảo trì", color: "bg-slate-100 text-slate-700" },
  news: { label: "Tin tức", color: "bg-brand-surface-low text-brand-secondary" },
  warning: { label: "Cảnh báo", color: "bg-amber-50 text-amber-700" },
};

const statusLabels: Record<AdminNotification["status"], { label: string; type: "success" | "warning" }> = {
  active: { label: "Đang hiển thị", type: "success" },
  inactive: { label: "Tạm ẩn", type: "warning" },
};

function getDestinationId(notification: AdminNotification) {
  return notification.destinationId || notification.destination_id || "";
}

function toNotificationFormValues(notification?: AdminNotification | null): NotificationFormValues {
  return {
    content: notification?.content || "",
    destinationId: notification ? getDestinationId(notification) : "",
    status: notification?.status || "active",
    title: notification?.title || "",
    type: notification?.type || "news",
  };
}

export default function AdminNotificationsPage() {
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [editingItem, setEditingItem] = useState<AdminNotification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<NotificationFormValues>({
    defaultValues: toNotificationFormValues(),
  });

  const destinationById = useMemo(
    () => new Map(destinations.map((destination) => [destination.id, destination])),
    [destinations],
  );

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);
      const [destinationItems, notificationItems] = await Promise.all([
        getAdminDestinations(),
        getAdminNotifications(),
      ]);
      setDestinations(destinationItems);
      setNotifications(notificationItems);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải thông báo.");
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return notifications.filter((notification) => {
      const destination = destinationById.get(getDestinationId(notification));
      const text = [notification.title, notification.content, destination?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !normalizedSearch || text.includes(normalizedSearch);
      const matchesType = !type || notification.type === type;
      const matchesStatus = !status || notification.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [destinationById, notifications, search, status, type]);

  const columns: Column<AdminNotification>[] = [
    {
      key: "title",
      header: "Tiêu đề",
      width: "240px",
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
        const typeConfig = notificationTypeLabels[row.type] || notificationTypeLabels.news;
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
      width: "180px",
      render: (row) => {
        const destination = destinationById.get(getDestinationId(row));
        return destination ? (
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="size-3.5" aria-hidden="true" />
            <span className="text-sm">{destination.name}</span>
          </div>
        ) : (
          <span className="text-slate-400">Toàn hệ thống</span>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "130px",
      render: (row) => {
        const statusConfig = statusLabels[row.status] || statusLabels.inactive;
        return <StatusBadge status={statusConfig.type} label={statusConfig.label} />;
      },
    },
  ];

  const actions: Action<AdminNotification>[] = [
    {
      icon: Edit,
      label: "Sửa",
      onClick: (row) => {
        setEditingItem(row);
        reset(toNotificationFormValues(row));
      },
      variant: "ghost",
    },
    {
      icon: Trash2,
      label: "Xóa",
      onClick: async (row) => {
        if (!window.confirm(`Xóa thông báo "${row.title}"?`)) return;
        try {
          await deleteAdminNotification(row.id);
          if (editingItem?.id === row.id) {
            setEditingItem(null);
            reset(toNotificationFormValues());
          }
          await loadData();
        } catch (deleteError) {
          setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa thông báo.");
        }
      },
      variant: "destructive",
    },
  ];

  function startCreate() {
    setEditingItem(null);
    reset(toNotificationFormValues());
  }

  async function onSubmit(values: NotificationFormValues) {
    const payload: AdminNotificationPayload = {
      content: values.content.trim(),
      destinationId: values.destinationId || null,
      status: values.status,
      title: values.title.trim(),
      type: values.type,
    };

    try {
      setIsSaving(true);
      setError(null);
      if (editingItem) {
        await updateAdminNotification(editingItem.id, payload);
      } else {
        await createAdminNotification(payload);
      }
      setEditingItem(null);
      reset(toNotificationFormValues());
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu thông báo.");
    } finally {
      setIsSaving(false);
    }
  }

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
        <Button type="button" onClick={startCreate}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Thêm thông báo
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
            <span className="text-xs font-bold uppercase text-slate-500">Tiêu đề</span>
            <Input
              placeholder="VD: Cảnh báo gió mạnh"
              aria-invalid={Boolean(errors.title)}
              {...register("title", {
                required: "Vui lòng nhập tiêu đề.",
                minLength: { value: 3, message: "Tiêu đề cần ít nhất 3 ký tự." },
                maxLength: { value: 150, message: "Tiêu đề không quá 150 ký tự." },
              })}
            />
            {errors.title?.message ? <span className="text-xs text-brand-danger">{errors.title.message}</span> : null}
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Loại</span>
            <Select
              {...register("type")}
              options={Object.entries(notificationTypeLabels).map(([value, config]) => ({
                label: config.label,
                value,
              }))}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Trạng thái</span>
            <Select
              {...register("status")}
              options={[
                { label: "Đang hiển thị", value: "active" },
                { label: "Tạm ẩn", value: "inactive" },
              ]}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Địa điểm</span>
            <Select
              {...register("destinationId")}
              options={[
                { label: "Toàn hệ thống", value: "" },
                ...destinations.map((destination) => ({ label: destination.name, value: destination.id })),
              ]}
            />
          </label>
          <label className="grid gap-1.5 lg:col-span-3">
            <span className="text-xs font-bold uppercase text-slate-500">Nội dung</span>
            <Textarea
              placeholder="Nội dung thông báo hiển thị cho người dùng"
              aria-invalid={Boolean(errors.content)}
              {...register("content", {
                required: "Vui lòng nhập nội dung.",
                minLength: { value: 10, message: "Nội dung cần ít nhất 10 ký tự." },
                maxLength: { value: 1000, message: "Nội dung không quá 1000 ký tự." },
              })}
            />
            {errors.content?.message ? <span className="text-xs text-brand-danger">{errors.content.message}</span> : null}
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
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder="Tìm kiếm thông báo…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={type}
            onChange={(event) => setType(event.target.value)}
            options={[
              { label: "Tất cả loại", value: "" },
              ...Object.entries(notificationTypeLabels).map(([value, config]) => ({
                label: config.label,
                value,
              })),
            ]}
          />
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { label: "Tất cả trạng thái", value: "" },
              { label: "Đang hiển thị", value: "active" },
              { label: "Tạm ẩn", value: "inactive" },
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
          loading={isLoading}
        />
      )}
    </div>
  );
}
