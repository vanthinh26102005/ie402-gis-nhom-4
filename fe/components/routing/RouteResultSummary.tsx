import { Navigation, Timer } from "lucide-react";
import { formatDistance, formatDuration } from "@/lib/format/duration";
import type { RouteResult } from "@/lib/types/routing";

type RouteResultSummaryProps = {
  route: RouteResult;
};

export function RouteResultSummary({ route }: RouteResultSummaryProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Navigation className="size-4" aria-hidden="true" />
          Quãng đường
        </div>
        <p className="mt-2 text-2xl font-semibold text-slate-950">
          {formatDistance(route.distanceMeters)}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Timer className="size-4" aria-hidden="true" />
          Thời gian dự kiến
        </div>
        <p className="mt-2 text-2xl font-semibold text-slate-950">
          {formatDuration(route.durationSeconds)}
        </p>
      </div>
    </div>
  );
}
