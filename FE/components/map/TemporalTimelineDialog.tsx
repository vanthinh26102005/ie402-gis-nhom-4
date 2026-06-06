"use client";

import { useMemo, useState } from "react";
import { Dialog } from "radix-ui";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CloudSun,
  Droplets,
  Gauge,
  Thermometer,
  Wind,
  X,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { isRiskyTraffic, isRiskyWeather } from "@/lib/map/temporal";
import type { TrafficInfo, WeatherInfo } from "@/lib/types/weather-traffic";
import { cn } from "@/lib/utils";

type TemporalTimelineKind = "weather" | "traffic";

type TemporalTimelineDialogProps = {
  kind: TemporalTimelineKind | null;
  locationName: string;
  traffic: TrafficInfo[];
  weather: WeatherInfo[];
  onOpenChange: (open: boolean) => void;
};

type TimelineItem =
  | {
      id: string;
      kind: "weather";
      observedAt: string;
      source: WeatherInfo;
      tone: "good" | "watch" | "bad";
      title: string;
      subtitle: string;
    }
  | {
      id: string;
      kind: "traffic";
      observedAt: string;
      source: TrafficInfo;
      tone: "good" | "watch" | "bad";
      title: string;
      subtitle: string;
    };

type TimelineDay = {
  dayStart: number;
  items: TimelineItem[];
  primaryItem: TimelineItem | null;
};

const DAY_MS = 86_400_000;
const WEEK_MS = DAY_MS * 7;

export function TemporalTimelineDialog({
  kind,
  locationName,
  onOpenChange,
  traffic,
  weather,
}: TemporalTimelineDialogProps) {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const observations = kind === "weather" ? weather : traffic;
  const timelineItems = useMemo(
    () => buildTimelineItems(kind, observations),
    [kind, observations],
  );
  const baseWeekStart = getBaseWeekStart(timelineItems);
  const weekStart = baseWeekStart + weekOffset * WEEK_MS;
  const weekEnd = weekStart + WEEK_MS;
  const weekDays = buildWeekDays(weekStart, timelineItems);
  const weekDataCount = weekDays.reduce((total, day) => total + day.items.length, 0);
  const title = kind === "weather" ? "Chi tiết thời tiết" : "Chi tiết giao thông";
  const description =
    kind === "weather"
      ? "Xem thời tiết đã ghi nhận và dự báo gần theo từng mốc trong tuần."
      : "Xem tình trạng kẹt xe đã ghi nhận và dự kiến theo từng mốc trong tuần.";

  function moveWeek(direction: -1 | 1) {
    setSelectedItem(null);
    setWeekOffset((current) => current + direction);
  }

  return (
    <Dialog.Root open={Boolean(kind)} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1800] bg-slate-950/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[1810] max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/70 bg-white shadow-2xl outline-none">
          <div className="flex max-h-[92vh] flex-col">
            <header className="border-b border-slate-200 bg-brand-surface-low px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-brand-primary">
                    {kind === "weather" ? (
                      <CloudSun className="size-4" aria-hidden="true" />
                    ) : (
                      <Car className="size-4" aria-hidden="true" />
                    )}
                    {title}
                  </p>
                  <Dialog.Title className="mt-2 text-2xl font-black leading-tight text-slate-950">
                    {locationName || "Địa điểm đang chọn"}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                    {description}
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Đóng dòng thời gian"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-slate-700 shadow-[var(--shadow-brand-map)] transition-colors hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/30"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>
            </header>

            <div className="min-h-0 overflow-auto p-5">
              {selectedItem ? (
                <TimelineDetail item={selectedItem} onBack={() => setSelectedItem(null)} />
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-500">
                        <CalendarDays className="size-4" aria-hidden="true" />
                        Tuần đang xem
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-950">
                        {formatWeekRange(weekStart, weekEnd)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => moveWeek(-1)}>
                        <ChevronLeft className="size-4" aria-hidden="true" />
                        Tuần trước
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => moveWeek(1)}>
                        Tuần sau
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {weekDataCount === 0 ? (
                    <div className="rounded-lg border border-dashed border-brand-outline-variant bg-brand-surface-low p-6 text-center">
                      <Clock3 className="mx-auto size-8 text-slate-400" aria-hidden="true" />
                      <p className="mt-3 text-base font-extrabold text-slate-950">
                        Chưa có dữ liệu trong tuần này
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Dùng Tuần trước hoặc Tuần sau để xem thêm dữ liệu đã ghi nhận hoặc dự báo gần.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {weekDays.map((day) => (
                        <TimelineDayCard
                          key={day.dayStart}
                          day={day}
                          kind={kind}
                          onSelect={(item) => setSelectedItem(item)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function TimelineDayCard({
  day,
  kind,
  onSelect,
}: {
  day: TimelineDay;
  kind: TemporalTimelineKind | null;
  onSelect: (item: TimelineItem) => void;
}) {
  const item = day.primaryItem;
  const dayLabel = formatDayLabelFromTimestamp(day.dayStart);

  if (!item) {
    return (
      <div className="min-h-40 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-500">{dayLabel}</p>
            <p className="mt-1 text-lg font-black leading-tight text-slate-950">Chưa có dữ liệu</p>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500">
            {kind === "traffic" ? (
              <Car className="size-5" aria-hidden="true" />
            ) : (
              <CloudSun className="size-5" aria-hidden="true" />
            )}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold leading-5 text-slate-600">
          Chưa có mốc ghi nhận hoặc dự báo trong ngày này.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn(
        "group min-h-40 rounded-lg border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/30",
        getToneClass(item.tone, "card"),
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase text-slate-500">
            {dayLabel}
          </p>
          <p className="mt-1 text-lg font-black leading-tight text-slate-950">{item.title}</p>
        </div>
        <span className={cn("grid size-10 place-items-center rounded-full", getToneClass(item.tone, "icon"))}>
          {item.kind === "weather" ? (
            <CloudSun className="size-5" aria-hidden="true" />
          ) : (
            <Car className="size-5" aria-hidden="true" />
          )}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-5 text-slate-600">{item.subtitle}</p>
      <div className="mt-4 flex items-center justify-between border-t border-white/80 pt-3 text-xs font-bold text-slate-500">
        <span>{formatRelativeDataLabel(item.observedAt)}</span>
        <span>{formatTimeLabel(item.observedAt)}</span>
      </div>
      {day.items.length > 1 ? (
        <p className="mt-2 text-xs font-bold text-slate-500">
          +{day.items.length - 1} mốc khác trong ngày
        </p>
      ) : null}
    </button>
  );
}

function TimelineDetail({
  item,
  onBack,
}: {
  item: TimelineItem;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <Button type="button" variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Quay lại dòng thời gian
      </Button>

      <section className={cn("rounded-lg border p-5", getToneClass(item.tone, "detail"))}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              {formatRelativeDataLabel(item.observedAt)}
            </p>
            <h3 className="mt-2 text-3xl font-black leading-tight text-slate-950">{item.title}</h3>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {formatDayLabel(item.observedAt)} · {formatTimeLabel(item.observedAt)}
            </p>
          </div>
          <span className={cn("grid size-14 place-items-center rounded-full", getToneClass(item.tone, "icon"))}>
            {item.kind === "weather" ? (
              <CloudSun className="size-7" aria-hidden="true" />
            ) : (
              <Car className="size-7" aria-hidden="true" />
            )}
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">{item.subtitle}</p>

        {item.kind === "weather" ? (
          <WeatherDetailGrid weather={item.source} />
        ) : (
          <TrafficDetailGrid traffic={item.source} />
        )}
      </section>
    </div>
  );
}

function WeatherDetailGrid({ weather }: { weather: WeatherInfo }) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <DetailTile icon={Thermometer} label="Nhiệt độ" value={`${weather.temperature}°C`} />
      <DetailTile icon={Droplets} label="Độ ẩm" value={`${weather.humidity}%`} />
      <DetailTile icon={Wind} label="Gió" value={`${weather.wind_speed} km/h`} />
    </div>
  );
}

function TrafficDetailGrid({ traffic }: { traffic: TrafficInfo }) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <DetailTile icon={Gauge} label="Mức độ" value={traffic.congestion_level} />
      <DetailTile icon={AlertTriangle} label="Trạng thái" value={traffic.status || "Đang cập nhật"} />
      <div className="rounded-lg border border-white/80 bg-white/75 p-3 sm:col-span-2">
        <p className="text-xs font-extrabold uppercase text-slate-500">Ghi chú</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
          {traffic.description || "Chưa có mô tả chi tiết."}
        </p>
      </div>
    </div>
  );
}

function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Thermometer;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/80 bg-white/75 p-3">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-500">
        <Icon className="size-4 text-brand-primary" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-base font-black text-slate-950">{value}</p>
    </div>
  );
}

function buildTimelineItems(
  kind: TemporalTimelineKind | null,
  observations: WeatherInfo[] | TrafficInfo[],
) {
  if (!kind) return [];

  return observations
    .map((item): TimelineItem => {
      if (kind === "weather") {
        const weather = item as WeatherInfo;
        const tone = weather.weather_status === "Mưa bão" ? "bad" : isRiskyWeather(weather) ? "watch" : "good";

        return {
          id: weather.weather_id,
          kind,
          observedAt: weather.observed_at,
          source: weather,
          subtitle: `${weather.temperature}°C · ${weather.humidity}% ẩm · gió ${weather.wind_speed} km/h`,
          title: weather.weather_status,
          tone,
        };
      }

      const traffic = item as TrafficInfo;
      const tone = ["Cấm đường", "Ùn tắc"].includes(traffic.congestion_level)
        ? "bad"
        : isRiskyTraffic(traffic)
          ? "watch"
          : "good";

      return {
        id: traffic.traffic_id,
        kind,
        observedAt: traffic.observed_at,
        source: traffic,
        subtitle: traffic.status || traffic.description || "Đang cập nhật tình trạng giao thông",
        title: traffic.congestion_level,
        tone,
      };
    })
    .sort((a, b) => new Date(a.observedAt).getTime() - new Date(b.observedAt).getTime());
}

function getBaseWeekStart(items: TimelineItem[]) {
  const now = Date.now();
  if (items.length === 0) return startOfWeek(now);

  const nearest = items.reduce((best, item) => {
    const currentTime = new Date(item.observedAt).getTime();
    const bestTime = new Date(best.observedAt).getTime();
    return Math.abs(currentTime - now) < Math.abs(bestTime - now) ? item : best;
  }, items[0]);

  return startOfWeek(new Date(nearest.observedAt).getTime());
}

function buildWeekDays(weekStart: number, items: TimelineItem[]): TimelineDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const dayStart = weekStart + index * DAY_MS;
    const dayEnd = dayStart + DAY_MS;
    const dayItems = items.filter((item) => {
      const time = new Date(item.observedAt).getTime();
      return Number.isFinite(time) && time >= dayStart && time < dayEnd;
    });

    return {
      dayStart,
      items: dayItems,
      primaryItem: pickPrimaryDayItem(dayItems),
    };
  });
}

function pickPrimaryDayItem(items: TimelineItem[]) {
  if (items.length === 0) return null;

  const priority = {
    bad: 3,
    watch: 2,
    good: 1,
  };

  return [...items].sort((a, b) => {
    const toneDiff = priority[b.tone] - priority[a.tone];
    if (toneDiff !== 0) return toneDiff;
    return new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime();
  })[0];
}

function startOfWeek(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  return date.getTime();
}

function formatWeekRange(start: number, end: number) {
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end - DAY_MS))}`;
}

function formatDayLabel(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    weekday: "short",
  }).format(new Date(value));
}

function formatDayLabelFromTimestamp(value: number) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    weekday: "short",
  }).format(new Date(value));
}

function formatTimeLabel(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRelativeDataLabel(value: string) {
  const time = new Date(value).getTime();
  const now = Date.now();
  if (!Number.isFinite(time)) return "Mốc dữ liệu";
  if (time > now) return "Dự báo gần";
  if (Math.abs(time - now) < 2 * 60 * 60 * 1000) return "Gần hiện tại";
  return "Đã ghi nhận";
}

function getToneClass(tone: TimelineItem["tone"], variant: "card" | "detail" | "icon") {
  const classes = {
    card: {
      bad: "border-red-200 bg-red-50 hover:border-red-300",
      good: "border-emerald-200 bg-emerald-50 hover:border-emerald-300",
      watch: "border-amber-200 bg-amber-50 hover:border-amber-300",
    },
    detail: {
      bad: "border-red-200 bg-red-50",
      good: "border-emerald-200 bg-emerald-50",
      watch: "border-amber-200 bg-amber-50",
    },
    icon: {
      bad: "bg-red-100 text-red-700",
      good: "bg-emerald-100 text-emerald-700",
      watch: "bg-amber-100 text-amber-700",
    },
  };

  return classes[variant][tone];
}
