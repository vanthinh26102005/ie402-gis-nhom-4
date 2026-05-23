"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { LoadingSpinner } from "./LoadingState";
import type { LucideIcon } from "lucide-react";
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type Column<T> = {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
};

export type Action<T> = {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "destructive" | "ghost";
  onClick?: (row: T) => void;
  href?: (row: T) => string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
};

export function DataTable<T>({
  data,
  columns,
  actions = [],
  keyExtractor,
  emptyMessage = "Không có dữ liệu",
  loading = false,
  className,
  pagination,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const [openActions, setOpenActions] = useState<string | null>(null);

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 0;

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedIds.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(keyExtractor));
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden", className)}>
        <div className="animate-pulse p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {columns.map((col, j) => (
                <div
                  key={j}
                  className="h-4 animate-pulse rounded bg-slate-200"
                  style={{ width: col.width || "100px" }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center", className)}>
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("px-4 py-3 font-semibold", col.sortable && "cursor-pointer hover:text-slate-900")}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && <th className="w-16 px-4 py-3 text-right">Thao tác</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => {
              const id = keyExtractor(row);
              const isSelected = selectedIds.includes(id);

              return (
                <tr
                  key={id}
                  className={cn(
                    "transition-colors hover:bg-slate-50/50",
                    isSelected && "bg-primary/5"
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(id)}
                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row, index) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {actions.length === 1 ? (
                          (() => {
                            const action = actions[0];
                            const ActionIcon = action.icon;
                            return action.href ? (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={action.href(row)}>
                                  {ActionIcon && <ActionIcon className="size-4" aria-hidden="true" />}
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => action.onClick?.(row)}
                              >
                                {ActionIcon && <ActionIcon className="size-4" aria-hidden="true" />}
                              </Button>
                            );
                          })()
                        ) : (
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setOpenActions(openActions === id ? null : id)}
                              aria-label="Mở menu thao tác"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                            {openActions === id && (
                              <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                {actions.map((action, actionIndex) => {
                                  const Icon = action.icon;
                                  return (
                                    <button
                                      key={actionIndex}
                                      onClick={() => {
                                        action.onClick?.(row);
                                        setOpenActions(null);
                                      }}
                                      className={cn(
                                        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                                        action.variant === "destructive"
                                          ? "text-red-600 hover:bg-red-50"
                                          : "text-slate-700 hover:bg-slate-50"
                                      )}
                                    >
                                      {Icon && <Icon className="size-4" aria-hidden="true" />}
                                      {action.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <p className="text-sm text-slate-500">
            Hiển thị {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} của {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Trước
            </Button>
            <span className="text-sm text-slate-600">
              Trang {pagination.page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              Sau
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
