"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import type { LucideIcon } from "lucide-react";
import { Plus, FileText, Search } from "lucide-react";
import Link from "next/link";

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
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-surface-low">
          <Icon className="size-6 text-[#6a6a6a]" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-semibold text-brand-secondary">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-[#6a6a6a]">{description}</p>}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Button asChild>
              <Link href={action.href}>
                <Plus className="mr-2 size-4" aria-hidden="true" />
                {action.label}
              </Link>
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
        "flex flex-col items-center justify-center rounded-brand-card border border-dashed border-brand-outline-variant bg-white p-8 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-surface-low">
        <Search className="size-6 text-[#6a6a6a]" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-brand-secondary">Không tìm thấy kết quả</h3>
      <p className="mt-1 text-sm text-[#6a6a6a]">
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
        "flex flex-col items-center justify-center rounded-brand-card border border-dashed border-brand-outline-variant bg-white p-8 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-surface-low">
        <FileText className="size-6 text-[#6a6a6a]" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-brand-secondary">{title}</h3>
      {description && <p className="mt-1 text-sm text-[#6a6a6a]">{description}</p>}
    </div>
  );
}
