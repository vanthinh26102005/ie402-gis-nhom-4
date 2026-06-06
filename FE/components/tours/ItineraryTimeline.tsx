"use client";

import { ArrowDown, ArrowUp, Clock3, MapPin, Trash2 } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import type { DestinationSummary } from "@/lib/types/destination";
import type { TourPlannerFormValues } from "@/components/tours/TourPlannerForm";

type ItineraryTimelineProps = {
  destinations: DestinationSummary[];
  stops: TourPlannerFormValues["stops"];
  register: UseFormRegister<TourPlannerFormValues>;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
};

export function ItineraryTimeline({
  destinations,
  stops,
  register,
  onMove,
  onRemove,
}: ItineraryTimelineProps) {
  const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));

  return (
    <div className="space-y-3">
      {stops.map((stop, index) => {
        const destination = destinationById.get(stop.destinationId);
        return (
          <article
            key={`${stop.destinationId}-${index}`}
            className="grid gap-4 rounded-lg border border-brand-outline-variant bg-white p-4 md:grid-cols-[44px_minmax(0,1fr)_auto]"
          >
            <div className="grid size-11 place-items-center rounded-full bg-brand-secondary font-mono text-sm font-bold text-white">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-brand-secondary">
                    {destination?.name || "Điểm đến"}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-[#6a6a6a]">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {destination?.province.name}
                  </p>
                </div>
                <span className="rounded-full bg-brand-surface-low px-3 py-1 text-xs font-medium text-brand-secondary">
                  {destination?.category?.name || "Tham quan"}
                </span>
              </div>

              <input type="hidden" {...register(`stops.${index}.destinationId`)} />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-xs font-medium text-[#6a6a6a]">
                  Ngày
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    className="mt-1 h-11"
                    {...register(`stops.${index}.dayNumber`, { valueAsNumber: true })}
                  />
                </label>
                <label className="text-xs font-medium text-[#6a6a6a]">
                  Đến lúc
                  <Input type="time" className="mt-1 h-11" {...register(`stops.${index}.arrivalTime`)} />
                </label>
                <label className="text-xs font-medium text-[#6a6a6a]">
                  Rời lúc
                  <Input type="time" className="mt-1 h-11" {...register(`stops.${index}.departureTime`)} />
                </label>
                <label className="text-xs font-medium text-[#6a6a6a]">
                  Phút tham quan
                  <Input
                    type="number"
                    min={15}
                    step={15}
                    className="mt-1 h-11"
                    {...register(`stops.${index}.stayMinutes`, { valueAsNumber: true })}
                  />
                </label>
              </div>
              <label className="mt-3 block text-xs font-medium text-[#6a6a6a]">
                Ghi chú tại điểm
                <Input
                  className="mt-1 h-11"
                  placeholder="Đặt vé trước, nghỉ ăn trưa, ưu tiên đi sớm..."
                  {...register(`stops.${index}.note`)}
                />
              </label>
              <input type="hidden" {...register(`stops.${index}.estimatedCost`, { valueAsNumber: true })} />
              <p className="mt-3 flex items-center gap-1 text-xs text-[#6a6a6a]">
                <Clock3 className="size-3.5" aria-hidden="true" />
                Giá vé tham khảo: {(destination?.ticketPrice ?? 0).toLocaleString("vi-VN")}đ/người
              </p>
            </div>
            <div className="flex gap-1 md:flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Đưa điểm lên trước"
                disabled={index === 0}
                onClick={() => onMove(index, -1)}
              >
                <ArrowUp className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Đưa điểm xuống sau"
                disabled={index === stops.length - 1}
                onClick={() => onMove(index, 1)}
              >
                <ArrowDown className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Xóa điểm khỏi kế hoạch"
                onClick={() => onRemove(index)}
                className="text-brand-danger"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
