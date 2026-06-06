import type { TrafficInfo, WeatherInfo } from "@/lib/types/weather-traffic";

export type TemporalObservation = WeatherInfo | TrafficInfo;
export type TemporalMode = "latest" | "at" | "cumulative";
export type TemporalStepMinutes = 30 | 60 | 120 | 180;

const MINUTE_MS = 60_000;

export function getObservationTime(value: string) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function getTemporalKey(item: TemporalObservation) {
  return item.destination_id || ("weather_id" in item ? item.weather_id : item.traffic_id);
}

export function buildTemporalTicks(items: readonly TemporalObservation[]) {
  return buildTemporalTicksFromSources(items);
}

export function buildTemporalTicksFromSources(
  ...sources: Array<readonly TemporalObservation[]>
) {
  const ticks = new Set<number>();

  sources.forEach((items) => {
    items.forEach((item) => {
      const time = getObservationTime(item.observed_at);
      if (time !== null) ticks.add(time);
    });
  });

  return Array.from(ticks).sort((a, b) => a - b);
}

export function buildSteppedTemporalTicks(
  items: readonly TemporalObservation[],
  stepMinutes: TemporalStepMinutes,
  range?: {
    endTime?: number | null;
    startTime?: number | null;
  },
) {
  const rawTicks = buildTemporalTicks(items);
  if (rawTicks.length < 2) return rawTicks;

  const stepMs = stepMinutes * MINUTE_MS;
  const requestedStart = range?.startTime ?? rawTicks[0];
  const requestedEnd = range?.endTime ?? rawTicks[rawTicks.length - 1];
  if (requestedEnd < requestedStart) return [];

  const dataStart = Math.floor(rawTicks[0] / stepMs) * stepMs;
  const dataEnd = Math.ceil(rawTicks[rawTicks.length - 1] / stepMs) * stepMs;
  const start = Math.max(dataStart, Math.floor(requestedStart / stepMs) * stepMs);
  const end = Math.min(dataEnd, Math.ceil(requestedEnd / stepMs) * stepMs);
  if (end < start) return [];

  const ticks: number[] = [];

  for (let tick = start; tick <= end; tick += stepMs) {
    ticks.push(tick);
  }

  return ticks;
}

export function filterObservationsByDestination<T extends TemporalObservation>(
  items: readonly T[],
  destinationId: string | null,
) {
  if (!destinationId) return [];
  return items.filter((item) => item.destination_id === destinationId);
}

export function pickNewestObservation<T extends TemporalObservation>(items: readonly T[]) {
  let newest: T | null = null;
  let newestTime: number | null = null;

  items.forEach((item) => {
    const itemTime = getObservationTime(item.observed_at);
    if (itemTime === null) return;

    if (!newest || newestTime === null || itemTime >= newestTime) {
      newest = item;
      newestTime = itemTime;
    }
  });

  return newest;
}

export function pickLatestByTime<T extends TemporalObservation>(
  items: readonly T[],
  timestamp: number | null,
) {
  if (timestamp === null) return [...items];

  const latestByKey = new Map<string, T>();

  items.forEach((item) => {
    const itemTime = getObservationTime(item.observed_at);
    if (itemTime === null || itemTime > timestamp) return;

    const key = getTemporalKey(item);
    const current = latestByKey.get(key);
    const currentTime = current ? getObservationTime(current.observed_at) : null;

    if (!current || currentTime === null || itemTime >= currentTime) {
      latestByKey.set(key, item);
    }
  });

  return Array.from(latestByKey.values());
}

export function pickLatestObservations<T extends TemporalObservation>(items: readonly T[]) {
  const latestByKey = new Map<string, T>();

  items.forEach((item) => {
    const itemTime = getObservationTime(item.observed_at);
    const key = getTemporalKey(item);
    const current = latestByKey.get(key);
    const currentTime = current ? getObservationTime(current.observed_at) : null;

    if (!current || currentTime === null || (itemTime !== null && itemTime >= currentTime)) {
      latestByKey.set(key, item);
    }
  });

  return Array.from(latestByKey.values());
}

export function pickCumulativeByTime<T extends TemporalObservation>(
  items: readonly T[],
  timestamp: number | null,
) {
  if (timestamp === null) return [...items];

  return items.filter((item) => {
    const itemTime = getObservationTime(item.observed_at);
    return itemTime !== null && itemTime <= timestamp;
  });
}

export function pickTemporalObservations<T extends TemporalObservation>(
  items: readonly T[],
  timestamp: number | null,
  mode: TemporalMode,
) {
  if (mode === "latest") return pickLatestObservations(items);
  if (mode === "cumulative") return pickCumulativeByTime(items, timestamp);
  return pickLatestByTime(items, timestamp);
}

export function isRiskyWeather(item: WeatherInfo) {
  return ["Nắng nóng", "Mưa rào", "Mưa bão", "Có sương mù"].includes(item.weather_status);
}

export function isRiskyTraffic(item: TrafficInfo) {
  return item.congestion_level !== "Thông thoáng";
}
