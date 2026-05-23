"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, CloudSun, Compass, Copy, MapPin, Navigation, Ticket } from "lucide-react";
import { formatVnd } from "@/lib/format/currency";
import type { DestinationDetail } from "@/lib/types/destination";

type DestinationInfoPanelProps = {
  destination: DestinationDetail;
};

export function DestinationInfoPanel({ destination }: DestinationInfoPanelProps) {
  const [copied, setCopied] = useState(false);

  function handleCopyCoords() {
    const coordsText = `${destination.location.latitude.toFixed(6)}, ${destination.location.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(coordsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5 rounded-brand-card border border-brand-outline-variant/30 bg-brand-surface-lowest p-6 shadow-sm">
      <h3 className="flex items-center gap-2 border-b border-brand-outline-variant/20 pb-2 text-lg font-bold text-brand-primary">
        <Compass className="size-5 text-brand-primary" />
        Thông tin hành trình
      </h3>

      <div className="space-y-4">
        <InfoRow icon={MapPin} label="Địa chỉ" value={destination.address || destination.province.name} />
        <InfoRow
          icon={Clock}
          label="Giờ mở cửa"
          value={
            destination.openTime && destination.closeTime
              ? `${destination.openTime} - ${destination.closeTime}`
              : "Đang cập nhật"
          }
        />
        <InfoRow icon={Ticket} label="Giá vé tham khảo" value={formatVnd(destination.ticketPrice)} />

        <div className="flex gap-3 pb-2">
          <Compass className="mt-0.5 size-5 shrink-0 text-brand-secondary" />
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tọa độ GIS</h4>
            <div className="mt-1 flex items-center justify-between rounded-lg border border-brand-outline-variant/20 bg-brand-surface-low px-2.5 py-1 text-xs">
              <span className="font-mono font-medium text-slate-700">
                {destination.location.latitude.toFixed(5)}°, {destination.location.longitude.toFixed(5)}°
              </span>
              <button
                type="button"
                onClick={handleCopyCoords}
                className="cursor-pointer rounded p-0.5 text-slate-400 transition hover:text-brand-primary"
                title="Sao chép tọa độ"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-brand-outline-variant/20 pt-4">
          <Link
            href={`/route?end=${destination.id}`}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-primary-container"
          >
            <Navigation className="size-4 shrink-0" />
            <span>Chỉ đường đến đây</span>
          </Link>
          <Link
            href={`/weather-traffic?province=${destination.province.name}`}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-2.5 text-xs font-bold text-brand-primary transition-all hover:bg-brand-primary/10"
          >
            <CloudSun className="size-4 shrink-0" />
            <span>Xem thời tiết & giao thông</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-brand-secondary" />
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</h4>
        <p className="mt-0.5 text-xs font-semibold leading-relaxed text-slate-800">{value}</p>
      </div>
    </div>
  );
}
