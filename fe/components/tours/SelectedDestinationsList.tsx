"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Destination } from "@/lib/data/destinations";
import { cn } from "@/lib/utils";

type SelectedDestinationsListProps = {
  items: Destination[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
  className?: string;
};

export function SelectedDestinationsList({
  items,
  onMoveUp,
  onMoveDown,
  onRemove,
  className,
}: SelectedDestinationsListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Chưa có điểm đến nào. Chọn từ danh sách bên dưới và bấm &quot;Thêm vào
        tour&quot;.
      </p>
    );
  }

  return (
    <ol className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">
              {item.province} · {item.category}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              aria-label={`Đưa ${item.name} lên`}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onMoveDown(index)}
              disabled={index === items.length - 1}
              aria-label={`Đưa ${item.name} xuống`}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onRemove(index)}
              aria-label={`Xóa ${item.name} khỏi tour`}
            >
              <Trash2 className="size-4 text-red-600" />
            </Button>
          </div>
        </li>
      ))}
    </ol>
  );
}
