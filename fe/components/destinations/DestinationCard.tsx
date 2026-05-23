import Link from "next/link";
import { TouristDestination } from "@/lib/mockData";
import { MapPin, Clock, Ticket, Star, ArrowRight } from "lucide-react";

interface DestinationCardProps {
  destination: TouristDestination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const {
    destination_id,
    name,
    description,
    address,
    open_time,
    close_time,
    ticket_price,
    image_url,
    rating,
    province_id,
    category_id,
  } = destination;

  // Format price
  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  // Get category badge color class based on theme rules
  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case "Di sản":
        return "bg-brand-primary/10 text-brand-primary border-brand-primary/20";
      case "Sinh thái":
        return "bg-brand-tertiary/10 text-brand-tertiary border-brand-tertiary/20";
      case "Du lịch biển":
        return "bg-brand-secondary/10 text-brand-on-secondary-container border-brand-secondary/20";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div
      className="relative flex flex-col h-full bg-brand-surface-lowest border border-brand-outline-variant/35 rounded-brand-card shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Thumbnail image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image_url}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-white text-slate-800 shadow-sm border border-slate-100">
            {province_id}
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getCategoryClass(category_id)}`}>
            {category_id}
          </span>
        </div>
        {/* Rating overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-brand-primary shadow-sm text-xs font-extrabold border border-slate-100 z-20">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-brand-primary group-hover:text-brand-primary-container transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="mt-2 text-xs text-slate-500 line-clamp-2 flex-1 font-medium leading-relaxed">
          {description}
        </p>

        {/* Metadatas */}
        <div className="mt-4 space-y-2 border-t border-brand-outline-variant/20 pt-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <MapPin className="size-3.5 shrink-0 text-brand-primary/70" />
            <span className="line-clamp-1">{address}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-brand-primary/70" />
              <span>{open_time} - {close_time}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-brand-primary">
              <Ticket className="size-3.5 text-brand-primary/70" />
              <span>{formatPrice(ticket_price)}</span>
            </div>
          </div>
        </div>

        {/* Action Button (with stretched link to cover the whole card) */}
        <Link
          href={`/destinations/${destination_id}`}
          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 text-center text-xs font-bold text-white bg-brand-primary group-hover:bg-brand-primary-container rounded-xl transition-all shadow-sm active:scale-95 group/btn after:absolute after:inset-0 after:z-10"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="size-3.5 group-hover/btn:translate-x-1.5 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
}

