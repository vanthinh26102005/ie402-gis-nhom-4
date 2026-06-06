"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, ChevronRight, Clock3, Copy, MapPin, Route, Trash2, Users } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { TourLegDialog } from "@/components/tours/TourLegDialog";
import { createTour, deleteTour, fetchTour, updateTour } from "@/lib/api/tours";
import type { CreatedTour, TourLeg, TourStatus } from "@/lib/types/tour";

export function TourDetailView({ tourId }: { tourId: string }) {
  const router = useRouter();
  const [tour, setTour] = useState<CreatedTour | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [selectedLeg, setSelectedLeg] = useState<TourLeg | null>(null);

  useEffect(() => {
    fetchTour(tourId).then(setTour).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải kế hoạch.");
    });
  }, [tourId]);

  const days = useMemo(() => {
    const grouped = new Map<number, CreatedTour["destinations"]>();
    for (const destination of tour?.destinations || []) {
      grouped.set(destination.dayNumber, [...(grouped.get(destination.dayNumber) || []), destination]);
    }
    return [...grouped.entries()].sort(([left], [right]) => left - right);
  }, [tour]);
  const displayLegs = useMemo<TourLeg[]>(() => {
    if (!tour) return [];
    return tour.destinations.slice(0, -1).map((destination, index) => {
      const next = tour.destinations[index + 1];
      return tour.legs.find(
        (leg) => leg.fromDestinationId === destination.id && leg.toDestinationId === next.id,
      ) || {
        id: `pending-${index}`,
        fromDestinationId: destination.id,
        toDestinationId: next.id,
        legOrder: index + 1,
        travelMode: tour.travelMode,
        distanceKm: null,
        durationMinutes: null,
        departureTime: destination.departureTime,
        title: `${destination.name} đến ${next.name}`,
        note: "",
        routeGeometry: null,
      };
    });
  }, [tour]);
  const legByEndpoints = useMemo(
    () => new Map(displayLegs.map((leg) => [`${leg.fromDestinationId}:${leg.toDestinationId}`, leg])),
    [displayLegs],
  );

  async function changeStatus(status: TourStatus) {
    if (!tour) return;
    setIsBusy(true);
    try {
      setTour(await updateTour(tour.id, { status }));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Không thể cập nhật.");
    } finally {
      setIsBusy(false);
    }
  }

  async function duplicate() {
    if (!tour) return;
    setIsBusy(true);
    const result = await createTour({
      title: `${tour.title} - bản sao`,
      description: tour.description || "",
      stops: tour.destinations.map((destination) => ({
        destinationId: destination.id,
        dayNumber: destination.dayNumber,
        arrivalTime: destination.arrivalTime?.slice(0, 5) || "08:00",
        departureTime: destination.departureTime?.slice(0, 5) || "09:30",
        stayMinutes: destination.stayMinutes,
        estimatedCost: destination.estimatedCost,
        note: destination.note || "",
      })),
      legs: tour.legs,
      totalDistanceKm: tour.totalDistanceKm,
      estimatedDurationMinutes: tour.estimatedDurationMinutes,
      status: "draft",
      startDate: tour.startDate,
      endDate: tour.endDate,
      partySize: tour.partySize,
      budget: tour.budget,
      travelMode: tour.travelMode,
      pace: tour.pace,
    });
    setIsBusy(false);
    if (result.ok && result.data) router.push(`/tours/${result.data.id}`);
    else setError(result.message);
  }

  async function removeTour() {
    if (!tour || !window.confirm("Xóa kế hoạch này? Hành động không thể hoàn tác.")) return;
    setIsBusy(true);
    try {
      await deleteTour(tour.id);
      router.push("/tours");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa.");
      setIsBusy(false);
    }
  }

  if (error && !tour) return <p className="rounded-lg border border-brand-danger/25 bg-white p-5 text-brand-danger">{error}</p>;
  if (!tour) return <p className="rounded-lg bg-brand-surface-low p-6 text-sm text-[#6a6a6a]">Đang tải kế hoạch...</p>;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        {error ? <p className="rounded-lg border border-brand-danger/25 bg-white p-4 text-brand-danger">{error}</p> : null}
        {days.map(([dayNumber, destinations]) => (
          <section key={dayNumber} className="rounded-lg border border-brand-outline-variant bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-brand-primary">Ngày {dayNumber}</p>
                <h2 className="mt-1 text-xl font-semibold text-brand-secondary">{destinations.length} hoạt động</h2>
              </div>
              <CheckCircle2 className="size-5 text-brand-secondary" aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-0">
              {destinations.map((destination, index) => (
                <div key={destination.id}>
                  <article className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-3">
                    <span className="z-10 grid size-8 place-items-center rounded-full bg-brand-secondary text-xs font-bold text-white">{index + 1}</span>
                    <div className="rounded-lg bg-brand-surface-low p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-brand-secondary">{destination.name}</h3>
                          <p className="mt-1 flex items-center gap-1 text-sm text-[#6a6a6a]">
                            <MapPin className="size-3.5" />{destination.province.name}
                          </p>
                        </div>
                        <span className="font-mono text-sm font-semibold text-brand-secondary">
                          {(destination.arrivalTime || "").slice(0, 5)} - {(destination.departureTime || "").slice(0, 5)}
                        </span>
                      </div>
                      {destination.note ? <p className="mt-3 text-sm leading-6 text-[#3f3f3f]">{destination.note}</p> : null}
                    </div>
                  </article>
                  {index < destinations.length - 1 ? (() => {
                    const next = destinations[index + 1];
                    const leg = legByEndpoints.get(`${destination.id}:${next.id}`);
                    if (!leg) return null;
                    return (
                      <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 py-3">
                        <span className="mx-auto h-full w-px bg-brand-outline-variant" />
                        <button
                          type="button"
                          onClick={() => setSelectedLeg(leg)}
                          className="group flex min-h-16 items-center justify-between gap-4 rounded-lg border border-dashed border-brand-outline-variant bg-white px-4 py-3 text-left transition-colors hover:border-brand-secondary hover:bg-brand-surface-low"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-brand-secondary">
                              {leg.title || `Di chuyển đến ${next.name}`}
                            </p>
                            <p className="mt-1 text-xs text-[#6a6a6a]">
                              {leg.departureTime?.slice(0, 5) || "Chưa đặt giờ"} · {leg.durationMinutes ? `${leg.durationMinutes} phút` : "Chưa có ETA"}
                              {leg.note ? " · Đã có ghi chú" : ""}
                            </p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-primary">
                            Chi tiết chặng
                            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </span>
                        </button>
                      </div>
                    );
                  })() : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-lg border border-brand-outline-variant bg-white p-5 shadow-[var(--shadow-brand-map)]">
          <h2 className="text-lg font-semibold text-brand-secondary">Tóm tắt</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#3f3f3f]">
            <span className="flex items-center gap-2"><CalendarDays className="size-4" />{tour.startDate || "Chưa chọn ngày"}</span>
            <span className="flex items-center gap-2"><Users className="size-4" />{tour.partySize} người</span>
            <span className="flex items-center gap-2"><Route className="size-4" />{tour.totalDistanceKm ? `${tour.totalDistanceKm.toFixed(1)} km` : "Chưa có quãng đường"}</span>
            <span className="flex items-center gap-2"><Clock3 className="size-4" />{tour.estimatedDurationMinutes ? `${tour.estimatedDurationMinutes} phút` : "Linh hoạt"}</span>
          </div>
          <label className="mt-5 block text-sm font-medium text-brand-secondary">
            Trạng thái
            <Select
              className="mt-2"
              value={tour.status}
              disabled={isBusy}
              onChange={(event) => changeStatus(event.target.value as TourStatus)}
              options={[
                { label: "Bản nháp", value: "draft" },
                { label: "Đã sẵn sàng", value: "planned" },
                { label: "Đang đi", value: "active" },
                { label: "Đã hoàn thành", value: "completed" },
                { label: "Đã hủy", value: "cancelled" },
              ]}
            />
          </label>
        </section>
        <section className="rounded-lg border border-brand-outline-variant bg-white p-4">
          <div className="grid gap-2">
            <Button asChild variant="outline"><Link href={`/route?startId=${tour.destinationIds[0]}&endId=${tour.destinationIds.at(-1)}`}><Route className="size-4" />Mở lại trên bản đồ</Link></Button>
            <Button type="button" variant="outline" onClick={duplicate} disabled={isBusy}><Copy className="size-4" />Tạo bản sao</Button>
            <Button type="button" variant="ghost" onClick={removeTour} disabled={isBusy} className="text-brand-danger"><Trash2 className="size-4" />Xóa kế hoạch</Button>
          </div>
        </section>
      </aside>
      {selectedLeg ? (() => {
        const from = tour.destinations.find((destination) => destination.id === selectedLeg.fromDestinationId);
        const to = tour.destinations.find((destination) => destination.id === selectedLeg.toDestinationId);
        if (!from || !to) return null;
        return (
          <TourLegDialog
            tour={{ ...tour, legs: displayLegs }}
            leg={selectedLeg}
            from={from}
            to={to}
            onClose={() => setSelectedLeg(null)}
            onSaved={setTour}
          />
        );
      })() : null}
    </div>
  );
}
