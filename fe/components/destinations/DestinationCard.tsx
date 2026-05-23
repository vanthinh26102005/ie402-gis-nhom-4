import Link from "next/link";
import { ArrowRight, Clock, MapPin, Star, Ticket } from "lucide-react";
import { formatVnd } from "@/lib/format/currency";
import type { DestinationSummary } from "@/lib/types/destination";

type DestinationCardProps = {
  destination: DestinationSummary;
};

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-brand-card border border-brand-outline-variant/35 bg-brand-surface-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/5">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {destination.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-slate-100 bg-white px-2.5 py-0.5 text-xs font-bold text-slate-800 shadow-sm">
            {destination.province.name}
          </span>
          {destination.category ? (
            <span className="rounded-full border border-brand-primary/20 bg-brand-primary/10 px-2.5 py-0.5 text-xs font-bold text-brand-primary">
              {destination.category.name}
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 rounded-full border border-slate-100 bg-white px-2.5 py-0.5 text-xs font-extrabold text-brand-primary shadow-sm">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span>{destination.rating?.toFixed(1) ?? "N/A"}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-brand-primary transition-colors group-hover:text-brand-primary-container">
          {destination.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-xs font-medium leading-relaxed text-slate-500">
          {destination.description || "Chưa có mô tả cho địa điểm này."}
        </p>

        <div className="mt-4 space-y-2 border-t border-brand-outline-variant/20 pt-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <MapPin className="size-3.5 shrink-0 text-brand-primary/70" />
            <span className="line-clamp-1">{destination.address || destination.province.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-brand-primary/70" />
              <span>Đang cập nhật</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-brand-primary">
              <Ticket className="size-3.5 text-brand-primary/70" />
              <span>{formatVnd(destination.ticketPrice)}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/destinations/${destination.id}`}
          className="group/btn after:absolute after:inset-0 after:z-10 mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-center text-xs font-bold text-white shadow-sm transition-all group-hover:bg-brand-primary-container active:scale-95"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1.5" />
        </Link>
      </div>
    </div>
  );
}
