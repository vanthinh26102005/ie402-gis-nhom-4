"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit, Trash2, FolderTree } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { DataTable, Column, Action } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  type AdminCategory,
  type AdminCategoryPayload,
} from "@/lib/api/admin";

type CategoryFormValues = {
  description: string;
  name: string;
};

function toCategoryFormValues(category?: AdminCategory | null): CategoryFormValues {
  return {
    description: category?.description || "",
    name: category?.name || "",
  };
}

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [editingItem, setEditingItem] = useState<AdminCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CategoryFormValues>({
    defaultValues: toCategoryFormValues(),
  });

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);
      setCategories(await getAdminCategories());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải loại hình du lịch.");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = categories.filter((cat) => {
    if (!search) return true;
    return (
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const columns: Column<AdminCategory>[] = [
    {
      key: "name",
      header: "Tên loại hình",
      width: "180px",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-lg"
            style={{ backgroundColor: "#f3f4f5" }}
          >
            <div
              className="flex size-full items-center justify-center rounded-lg text-xs font-bold"
              style={{ color: "#6b7280" }}
            >
              {row.name.charAt(0)}
            </div>
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <div
              className="mt-0.5 h-1.5 w-12 rounded-full"
              style={{ backgroundColor: "#e5e7eb" }}
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
      key: "destinationsCount",
      header: "Số điểm",
      width: "100px",
      render: (row) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {row.destinationsCount}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Cập nhật",
      width: "130px",
      render: (row) => (
        <span className="text-slate-500">
          {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString("vi-VN") : "-"}
        </span>
      ),
    },
  ];

  const actions: Action<AdminCategory>[] = [
    {
      label: "Sửa",
      icon: Edit,
      variant: "ghost",
      onClick: (row) => {
        setEditingItem(row);
        reset(toCategoryFormValues(row));
      },
    },
    {
      label: "Xóa",
      icon: Trash2,
      variant: "destructive",
      onClick: async (row) => {
        if (!window.confirm(`Xóa loại hình "${row.name}"?`)) return;
        try {
          await deleteAdminCategory(row.id);
          if (editingItem?.id === row.id) {
            setEditingItem(null);
            reset(toCategoryFormValues());
          }
          await loadData();
        } catch (deleteError) {
          setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa loại hình.");
        }
      },
    },
  ];

  async function onSubmit(values: CategoryFormValues) {
    const payload: AdminCategoryPayload = {
      description: values.description.trim() || null,
      name: values.name.trim(),
    };

    try {
      setIsSaving(true);
      setError(null);
      if (editingItem) {
        await updateAdminCategory(editingItem.id, payload);
      } else {
        await createAdminCategory(payload);
      }
      setEditingItem(null);
      reset(toCategoryFormValues());
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu loại hình.");
    } finally {
      setIsSaving(false);
    }
  }

  function startCreate() {
    setEditingItem(null);
    reset(toCategoryFormValues());
  }

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
        <Button type="button" onClick={startCreate}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Thêm loại hình
        </Button>
      </div>

      {error ? (
        <Card className="border-brand-danger/25 bg-red-50 p-4 text-sm text-brand-danger">
          {error}
        </Card>
      ) : null}

      <Card className="p-4">
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Tên loại hình</span>
            <Input
              aria-invalid={Boolean(errors.name)}
              placeholder="VD: Di sản văn hóa"
              {...register("name", {
                required: "Vui lòng nhập tên loại hình.",
                minLength: { value: 2, message: "Tên cần ít nhất 2 ký tự." },
                maxLength: { value: 100, message: "Tên không quá 100 ký tự." },
              })}
            />
            {errors.name?.message ? <span className="text-xs text-brand-danger">{errors.name.message}</span> : null}
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase text-slate-500">Mô tả</span>
            <Input
              placeholder="Mục đích sử dụng loại hình này"
              {...register("description", {
                maxLength: { value: 300, message: "Mô tả không quá 300 ký tự." },
              })}
            />
            {errors.description?.message ? <span className="text-xs text-brand-danger">{errors.description.message}</span> : null}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder="Tìm kiếm loại hình…"
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
          loading={isLoading}
        />
      )}
    </div>
  );
}
