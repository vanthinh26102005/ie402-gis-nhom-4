import Link from "next/link";
import { ArrowRight, Heart, MapPin, Star, Ticket } from "lucide-react";
import { formatVnd } from "@/lib/format/currency";
import type { DestinationSummary } from "@/lib/types/destination";

type DestinationCardProps = {
  destination: DestinationSummary;
};

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col bg-white">
      <div className="relative aspect-square w-full overflow-hidden rounded-brand-card bg-brand-surface-container">
        {destination.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={destination.imageUrl}
            alt={destination.name}
            width={480}
            height={480}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="absolute left-3 top-3 z-20 flex max-w-[calc(100%-4.5rem)] flex-wrap gap-1.5">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand-secondary shadow-[var(--shadow-brand-map)]">
            {destination.province.name}
          </span>
          {destination.category ? (
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand-secondary shadow-[var(--shadow-brand-map)]">
              {destination.category.name}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          aria-label={`Lưu ${destination.name}`}
          className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-white/90 text-brand-secondary shadow-[var(--shadow-brand-map)] transition-[background-color,color] hover:bg-white hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20"
        >
          <Heart className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-brand-secondary">
            {destination.name}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm text-brand-secondary">
            <Star className="size-3.5 fill-brand-secondary text-brand-secondary" aria-hidden="true" />
            {destination.rating?.toFixed(1) ?? "N/A"}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-[#6a6a6a]">
          {destination.category?.name || "Điểm du lịch"}
        </p>
        <p className="mt-1 line-clamp-1 text-sm text-[#6a6a6a]">
          <MapPin className="mr-1 inline size-3.5 text-[#6a6a6a]" aria-hidden="true" />
          {destination.address || destination.province.name}
        </p>
        <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-secondary">
          <Ticket className="size-3.5 text-[#6a6a6a]" aria-hidden="true" />
          {formatVnd(destination.ticketPrice)}
        </p>

        <Link
          href={`/destinations/${destination.id}`}
          className="after:absolute after:inset-0 after:z-10 mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
