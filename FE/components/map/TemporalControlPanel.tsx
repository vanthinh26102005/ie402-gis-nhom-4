"use client";

import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Clock3,
  CloudSun,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import type { TemporalMode, TemporalStepMinutes } from "@/lib/map/temporal";
import { cn } from "@/lib/utils";

export type TemporalLocationOption = {
  id: string;
  name: string;
  provinceName?: string | null;
};

export type TemporalSignalTone = "good" | "watch" | "bad" | "muted";

export type TemporalSignal = {
  helper?: string;
  tone: TemporalSignalTone;
  value: string;
};

export type TemporalTravelAdvice = {
  description: string;
  title: string;
  tone: TemporalSignalTone;
};

type TemporalControlPanelProps = {
  advice: TemporalTravelAdvice;
  dateRangeEnd: string;
  dateRangeMax: string;
  dateRangeMin: string;
  dateRangeStart: string;
  endTimeLabel: string;
  isPlaying: boolean;
  locationOptions: TemporalLocationOption[];
  riskOnly: boolean;
  selectedDateLabel: string;
  selectedLocationId: string;
  selectedLocationName: string;
  selectedTimeLabel: string;
  startTimeLabel: string;
  stepMinutes: TemporalStepMinutes;
  temporalMode: TemporalMode;
  timeIndex: number;
  tickCount: number;
  trafficSignal: TemporalSignal;
  trafficCount: number;
  weatherSignal: TemporalSignal;
  weatherCount: number;
  onDateRangeEndChange: (value: string) => void;
  onDateRangeStartChange: (value: string) => void;
  onLocationChange: (destinationId: string) => void;
  onPlayToggle: () => void;
  onRiskOnlyChange: (enabled: boolean) => void;
  onStepMinutesChange: (stepMinutes: TemporalStepMinutes) => void;
  onTrafficDetailOpen: () => void;
  onTemporalModeChange: (mode: TemporalMode) => void;
  onTimeIndexChange: (timeIndex: number) => void;
  onWeatherDetailOpen: () => void;
};

const temporalModes: Array<{ label: string; mode: TemporalMode }> = [
  { label: "Hiện tại", mode: "latest" },
  { label: "Chọn giờ", mode: "at" },
  { label: "Diễn biến", mode: "cumulative" },
];

export function TemporalControlPanel({
  advice,
  dateRangeEnd,
  dateRangeMax,
  dateRangeMin,
  dateRangeStart,
  endTimeLabel,
  isPlaying,
  locationOptions,
  onDateRangeEndChange,
  onDateRangeStartChange,
  onLocationChange,
  onPlayToggle,
  onRiskOnlyChange,
  onStepMinutesChange,
  onTrafficDetailOpen,
  onTemporalModeChange,
  onTimeIndexChange,
  onWeatherDetailOpen,
  riskOnly,
  selectedDateLabel,
  selectedLocationId,
  selectedLocationName,
  selectedTimeLabel,
  startTimeLabel,
  stepMinutes,
  temporalMode,
  tickCount,
  timeIndex,
  trafficCount,
  trafficSignal,
  weatherSignal,
  weatherCount,
}: TemporalControlPanelProps) {
  const hasTimeline = tickCount > 0;
  const isTimelineDisabled = !hasTimeline || temporalMode === "latest";

  return (
    <section className="rounded-lg border border-brand-outline-variant bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-extrabold uppercase text-slate-500">
            Tình hình theo thời gian
          </h2>
          <p className="mt-1 text-sm font-semibold leading-5 text-slate-900">
            Chọn thời điểm để xem nơi này có thuận tiện để đi không.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-9 rounded-full px-3"
          disabled={tickCount < 2 || temporalMode === "latest"}
          onClick={onPlayToggle}
        >
          {isPlaying ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
          {isPlaying ? "Dừng" : "Phát"}
        </Button>
      </div>

      <div className={cn(
        "mt-3 rounded-lg border px-3 py-3",
        getToneClass(advice.tone, "advice"),
      )}>
        <div className="flex items-start gap-3">
          <span className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full",
            getToneClass(advice.tone, "icon"),
          )}>
            {advice.tone === "good" ? (
              <CheckCircle2 className="size-5" aria-hidden="true" />
            ) : (
              <AlertTriangle className="size-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Có nên đi lúc này?
            </p>
            <p className="mt-1 text-lg font-black leading-tight text-slate-950">
              {advice.title}
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              {advice.description}
            </p>
          </div>
        </div>
      </div>

      <label className="mt-3 block">
        <span className="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase text-slate-500">
          <MapPin className="size-3.5" aria-hidden="true" />
          Địa điểm đang xem
        </span>
        <select
          value={selectedLocationId}
          disabled={locationOptions.length === 0}
          onChange={(event) => onLocationChange(event.target.value)}
          className="min-h-11 w-full rounded-lg border border-brand-outline-variant bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10"
        >
          {locationOptions.length === 0 ? (
            <option value="">Chưa có địa điểm</option>
          ) : (
            locationOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.provinceName ? `${option.name} - ${option.provinceName}` : option.name}
              </option>
            ))
          )}
        </select>
      </label>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <SignalCard
          icon={CloudSun}
          label="Thời tiết"
          signal={weatherSignal}
          count={weatherCount}
          onOpenDetail={onWeatherDetailOpen}
        />
        <SignalCard
          icon={Car}
          label="Giao thông"
          signal={trafficSignal}
          count={trafficCount}
          onOpenDetail={onTrafficDetailOpen}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 rounded-full border border-brand-outline-variant bg-brand-surface-low p-1">
        {temporalModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            aria-pressed={temporalMode === item.mode}
            onClick={() => onTemporalModeChange(item.mode)}
            className={cn(
              "min-h-9 rounded-full px-2 text-xs font-bold transition-colors",
              temporalMode === item.mode
                ? "bg-white text-brand-secondary shadow-[var(--shadow-brand-map)]"
                : "text-[#6a6a6a] hover:text-brand-secondary",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-brand-outline-variant bg-brand-surface-low p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-500">Giờ đang xem</p>
            <p className="mt-1 text-base font-black text-slate-950">{selectedTimeLabel}</p>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-brand-secondary">
            {selectedLocationName || "Địa điểm"}
          </span>
        </div>

        <label className="mt-3 block">
          <span className="mb-2 block text-xs font-extrabold uppercase text-slate-500">
            Bước thời gian
          </span>
          <select
            value={stepMinutes}
            disabled={temporalMode === "latest"}
            onChange={(event) => onStepMinutesChange(Number(event.target.value) as TemporalStepMinutes)}
            className="min-h-10 w-full rounded-lg border border-brand-outline-variant bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 disabled:opacity-60"
          >
            <option value={30}>Mỗi 30 phút</option>
            <option value={60}>Mỗi 1 giờ</option>
            <option value={120}>Mỗi 2 giờ</option>
            <option value={180}>Mỗi 3 giờ</option>
          </select>
        </label>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase text-slate-500">
              Từ ngày
            </span>
            <input
              type="date"
              value={dateRangeStart}
              min={dateRangeMin}
              max={dateRangeEnd || dateRangeMax}
              disabled={temporalMode === "latest" || !dateRangeMin}
              onChange={(event) => onDateRangeStartChange(event.target.value)}
              className="min-h-10 w-full rounded-lg border border-brand-outline-variant bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase text-slate-500">
              Đến ngày
            </span>
            <input
              type="date"
              value={dateRangeEnd}
              min={dateRangeStart || dateRangeMin}
              max={dateRangeMax}
              disabled={temporalMode === "latest" || !dateRangeMax}
              onChange={(event) => onDateRangeEndChange(event.target.value)}
              className="min-h-10 w-full rounded-lg border border-brand-outline-variant bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 disabled:opacity-60"
            />
          </label>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(tickCount - 1, 0)}
          value={timeIndex}
          disabled={isTimelineDisabled}
          onChange={(event) => onTimeIndexChange(Number(event.target.value))}
          className="mt-3 w-full accent-brand-primary"
          aria-label="Chọn mốc thời gian bản đồ"
        />
        <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>{startTimeLabel}</span>
          <span>{endTimeLabel}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="size-3" aria-hidden="true" />
          {selectedDateLabel}
        </span>
      </div>
      <label className="mt-3 flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg border border-brand-outline-variant bg-brand-surface-low px-3 text-sm font-semibold text-brand-secondary">
        <span className="inline-flex items-center gap-1.5">
          <AlertTriangle className="size-4" aria-hidden="true" />
          Chỉ vùng cần chú ý
        </span>
        <input
          type="checkbox"
          checked={riskOnly}
          onChange={(event) => onRiskOnlyChange(event.target.checked)}
          className="size-4 rounded border-brand-outline-variant accent-brand-primary"
        />
      </label>
    </section>
  );
}

function SignalCard({
  count,
  icon: Icon,
  label,
  signal,
  onOpenDetail,
}: {
  count: number;
  icon: typeof CloudSun;
  label: string;
  onOpenDetail: () => void;
  signal: TemporalSignal;
}) {
  return (
    <div className={cn("rounded-lg border p-3", getToneClass(signal.tone, "signal"))}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-slate-500">
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </span>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-extrabold text-slate-500">
          {count} mốc
        </span>
      </div>
      <p className="mt-2 truncate text-sm font-black text-slate-950">{signal.value}</p>
      {signal.helper ? <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{signal.helper}</p> : null}
      <button
        type="button"
        onClick={onOpenDetail}
        className="mt-3 min-h-9 rounded-lg bg-white px-3 text-xs font-extrabold text-brand-secondary shadow-sm transition-colors hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/30"
      >
        Chi tiết
      </button>
    </div>
  );
}

function getToneClass(tone: TemporalSignalTone, variant: "advice" | "icon" | "signal") {
  const classes = {
    advice: {
      bad: "border-red-200 bg-red-50",
      good: "border-emerald-200 bg-emerald-50",
      muted: "border-slate-200 bg-slate-50",
      watch: "border-amber-200 bg-amber-50",
    },
    icon: {
      bad: "bg-red-100 text-red-700",
      good: "bg-emerald-100 text-emerald-700",
      muted: "bg-slate-100 text-slate-600",
      watch: "bg-amber-100 text-amber-700",
    },
    signal: {
      bad: "border-red-200 bg-red-50",
      good: "border-emerald-200 bg-emerald-50",
      muted: "border-slate-200 bg-slate-50",
      watch: "border-amber-200 bg-amber-50",
    },
  };

  return classes[variant][tone];
}
