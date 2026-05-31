"use client";

import { Route } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import type { DestinationSummary } from "@/lib/types/destination";

type RouteSearchPanelProps = {
  destinations: DestinationSummary[];
  startId: string;
  endId: string;
  isLoading: boolean;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onSubmit: () => void;
};

export function RouteSearchPanel({
  destinations,
  startId,
  endId,
  isLoading,
  onStartChange,
  onEndChange,
  onSubmit,
}: RouteSearchPanelProps) {
  const options = [
    { label: "Chọn địa điểm", value: "" },
    ...destinations.map((destination) => ({
      label: destination.name,
      value: destination.id,
    })),
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_160px]">
        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">Điểm bắt đầu</span>
          <Select
            value={startId}
            onChange={(event) => onStartChange(event.target.value)}
            options={options}
          />
        </label>
        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">Điểm đến</span>
          <Select
            value={endId}
            onChange={(event) => onEndChange(event.target.value)}
            options={options}
          />
        </label>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !startId || !endId || startId === endId}
          className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Route className="size-4" aria-hidden="true" />
          Tìm đường
        </Button>
      </div>
    </div>
  );
}
