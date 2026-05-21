"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import type { LucideIcon } from "lucide-react";
import { Plus, PlusCircle, FileText, Search } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
};

export function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-100">
          <Icon className="size-6 text-slate-400" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Button asChild>
              <a href={action.href}>
                <Plus className="mr-2 size-4" aria-hidden="true" />
                {action.label}
              </a>
            </Button>
          ) : (
            <Button onClick={action.onClick}>
              <Plus className="mr-2 size-4" aria-hidden="true" />
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

type NoSearchResultsProps = {
  keyword?: string;
  onClear?: () => void;
  className?: string;
};

export function NoSearchResults({ keyword, onClear, className }: NoSearchResultsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-100">
        <Search className="size-6 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">Không tìm thấy kết quả</h3>
      <p className="mt-1 text-sm text-slate-500">
        {keyword ? `Không có kết quả cho từ khóa "${keyword}"` : "Không có dữ liệu phù hợp"}
      </p>
      {onClear && (
        <Button variant="outline" onClick={onClear} className="mt-4">
          Xóa tìm kiếm
        </Button>
      )}
    </div>
  );
}

type NoDataYetProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function NoDataYet({ title = "Chưa có dữ liệu", description, className }: NoDataYetProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-100">
        <FileText className="size-6 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
