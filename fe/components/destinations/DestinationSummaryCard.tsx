import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import type { DestinationSummary } from "@/lib/gis";

type DestinationSummaryCardProps = {
  destination: DestinationSummary;
};

export function DestinationSummaryCard({ destination }: DestinationSummaryCardProps) {
  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="block cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-950">{destination.name}</h2>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{destination.province.name}</span>
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
          <Star className="size-3.5" aria-hidden="true" />
          {destination.rating?.toFixed(1) ?? "N/A"}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {destination.description || "Chưa có mô tả cho địa điểm này."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
        {destination.category ? (
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">
            {destination.category.name}
          </span>
        ) : null}
        <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
          {destination.ticketPrice ? `${destination.ticketPrice.toLocaleString("vi-VN")} đ` : "Miễn phí"}
        </span>
      </div>
    </Link>
  );
}
