"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Clock, MapPin, Star, Ticket } from "lucide-react";
import type { DestinationDetail as DestinationDetailType } from "@/lib/gis";
import { fetchDestinationDetail } from "@/lib/gis";

const DestinationMiniMap = dynamic(
  () => import("@/components/destinations/DestinationMiniMap").then((mod) => mod.DestinationMiniMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-600">
        Đang tải bản đồ vị trí...
      </div>
    ),
  },
);

type DestinationDetailProps = {
  id: string;
};

function formatPrice(value: number | null) {
  return value ? `${value.toLocaleString("vi-VN")} đ` : "Miễn phí";
}

export function DestinationDetail({ id }: DestinationDetailProps) {
  const [destination, setDestination] = useState<DestinationDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDestination() {
      try {
        setIsLoading(true);
        setError(null);
        const item = await fetchDestinationDetail(id);
        if (isMounted) {
          setDestination(item);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không thể tải chi tiết địa điểm.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDestination();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Đang tải chi tiết địa điểm...
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error || "Không tìm thấy địa điểm."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-5">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[16/7] bg-slate-200">
            {destination.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Chưa có hình ảnh
              </div>
            )}
          </div>
          <div className="p-5">
            <p className="text-sm font-semibold uppercase text-emerald-700">
              {destination.category?.name || "Địa điểm du lịch"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              {destination.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {destination.description || "Chưa có mô tả cho địa điểm này."}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <InfoTile
            icon={MapPin}
            label="Địa chỉ"
            value={destination.address || destination.province.name}
          />
          <InfoTile
            icon={Clock}
            label="Giờ mở cửa"
            value={
              destination.openTime && destination.closeTime
                ? `${destination.openTime} - ${destination.closeTime}`
                : "Đang cập nhật"
            }
          />
          <InfoTile
            icon={Ticket}
            label="Giá vé"
            value={formatPrice(destination.ticketPrice)}
          />
          <InfoTile
            icon={Star}
            label="Đánh giá"
            value={destination.rating?.toFixed(1) || "N/A"}
          />
        </div>
      </section>

      <aside className="space-y-4">
        <DestinationMiniMap location={destination.location} name={destination.name} />
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Tọa độ</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Latitude</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {destination.location.latitude.toFixed(5)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Longitude</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {destination.location.longitude.toFixed(5)}
              </dd>
            </div>
          </dl>
        </div>
        {destination.weather ? (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">Thời tiết demo</h2>
            <p className="mt-2 text-sm text-slate-600">
              {destination.weather.weatherStatus || "Đang cập nhật"} ·{" "}
              {destination.weather.temperature ?? "N/A"}°C
            </p>
          </div>
        ) : null}
        {destination.traffic ? (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">Giao thông demo</h2>
            <p className="mt-2 text-sm text-slate-600">{destination.traffic.status}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

type InfoTileProps = {
  icon: typeof MapPin;
  label: string;
  value: string;
};

function InfoTile({ icon: Icon, label, value }: InfoTileProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
