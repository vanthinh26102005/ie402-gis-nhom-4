"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Ticket, Compass, Copy, Check, Navigation, CloudSun } from "lucide-react";
import { TouristDestination } from "@/lib/mockData";

interface DestinationInfoPanelProps {
  destination: TouristDestination;
}

export function DestinationInfoPanel({ destination }: DestinationInfoPanelProps) {
  const [copied, setCopied] = useState(false);

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí vé vào cổng";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const handleCopyCoords = () => {
    const coordsText = `${destination.location_geom.lat.toFixed(6)}, ${destination.location_geom.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-surface-lowest rounded-brand-card p-6 border border-brand-outline-variant/30 shadow-sm space-y-5">
      <h3 className="text-lg font-bold text-brand-primary border-b border-brand-outline-variant/20 pb-2 flex items-center gap-2">
        <Compass className="size-5 text-brand-primary" /> Thông tin hành trình
      </h3>

      <div className="space-y-4">
        {/* Address */}
        <div className="flex gap-3">
          <MapPin className="size-5 shrink-0 text-brand-secondary mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Địa chỉ</h4>
            <p className="text-xs text-slate-800 mt-0.5 leading-relaxed font-semibold">{destination.address}</p>
          </div>
        </div>

        {/* Open Hours */}
        <div className="flex gap-3">
          <Clock className="size-5 shrink-0 text-brand-secondary mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giờ mở cửa</h4>
            <p className="text-xs text-slate-800 mt-0.5 font-bold">
              {destination.open_time} - {destination.close_time}
            </p>
          </div>
        </div>

        {/* Ticket Price */}
        <div className="flex gap-3">
          <Ticket className="size-5 shrink-0 text-brand-secondary mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giá vé tham khảo</h4>
            <p className="text-xs text-brand-primary mt-0.5 font-extrabold text-sm">
              {formatPrice(destination.ticket_price)}
            </p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="flex gap-3 pb-2">
          <Compass className="size-5 shrink-0 text-brand-secondary mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tọa độ GIS</h4>
            <div className="flex items-center justify-between mt-1 bg-brand-surface-low rounded-lg border border-brand-outline-variant/20 px-2.5 py-1 text-xs">
              <span className="font-mono text-slate-700 font-medium">
                {destination.location_geom.lat.toFixed(5)}°, {destination.location_geom.lng.toFixed(5)}°
              </span>
              <button
                type="button"
                onClick={handleCopyCoords}
                className="text-slate-400 hover:text-brand-primary p-0.5 rounded transition cursor-pointer"
                title="Sao chép tọa độ"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600 animate-scale-in" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Action Buttons */}
        <div className="pt-4 border-t border-brand-outline-variant/20 flex flex-col gap-2.5">
          <Link
            href={`/route?end=${destination.destination_id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-container rounded-xl transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
          >
            <Navigation className="size-4 shrink-0" />
            <span>Chỉ đường đến đây</span>
          </Link>
          <Link
            href={`/weather-traffic?province=${destination.province_id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/20 rounded-xl transition-all active:scale-98 cursor-pointer"
          >
            <CloudSun className="size-4 shrink-0" />
            <span>Xem thời tiết & giao thông</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
