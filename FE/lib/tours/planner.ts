import type { DestinationSummary } from "@/lib/types/destination";
import type { TourPace, TourStopInput } from "@/lib/types/tour";

const PACE_STAY_MINUTES: Record<TourPace, number> = {
  compact: 60,
  balanced: 90,
  relaxed: 120,
};

export function addMinutes(time: string, minutes: number) {
  const [hours, minute] = time.split(":").map(Number);
  const total = Math.max(0, hours * 60 + minute + minutes);
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function buildScheduledStops(
  destinationIds: string[],
  destinations: DestinationSummary[],
  pace: TourPace,
  startTime = "08:00",
): TourStopInput[] {
  const byId = new Map(destinations.map((destination) => [destination.id, destination]));
  const stayMinutes = PACE_STAY_MINUTES[pace];
  let cursor = startTime;

  return destinationIds.map((destinationId, index) => {
    const destination = byId.get(destinationId);
    const arrivalTime = cursor;
    const departureTime = addMinutes(arrivalTime, stayMinutes);
    cursor = addMinutes(departureTime, 30);
    return {
      destinationId,
      dayNumber: 1,
      arrivalTime,
      departureTime,
      stayMinutes,
      estimatedCost: destination?.ticketPrice ?? 0,
      note: index === 0 ? "Điểm bắt đầu hành trình" : index === destinationIds.length - 1 ? "Điểm kết thúc hành trình" : "",
    };
  });
}

export type PlannerInsight = {
  id: string;
  tone: "positive" | "warning" | "info";
  title: string;
  description: string;
};

export function buildPlannerInsights({
  stops,
  destinations,
  budget,
  partySize,
}: {
  stops: TourStopInput[];
  destinations: DestinationSummary[];
  budget: number | null;
  partySize: number;
}) {
  const byId = new Map(destinations.map((destination) => [destination.id, destination]));
  const insights: PlannerInsight[] = [];
  const totalCost = stops.reduce((sum, stop) => sum + stop.estimatedCost * partySize, 0);
  const categories = new Set(
    stops.map((stop) => byId.get(stop.destinationId)?.category?.name).filter(Boolean),
  );

  if (budget !== null && totalCost > budget) {
    insights.push({
      id: "budget",
      tone: "warning",
      title: "Chi phí vé đang vượt ngân sách",
      description: `Ước tính vé ${totalCost.toLocaleString("vi-VN")}đ cho ${partySize} người.`,
    });
  } else {
    insights.push({
      id: "budget-ok",
      tone: "positive",
      title: "Chi phí vé đang trong tầm kiểm soát",
      description: `Ước tính ${totalCost.toLocaleString("vi-VN")}đ cho cả nhóm.`,
    });
  }

  if (stops.length >= 4 && new Set(stops.map((stop) => stop.dayNumber)).size === 1) {
    insights.push({
      id: "dense-day",
      tone: "warning",
      title: "Ngày đầu đang khá dày",
      description: "Nên chuyển một điểm sang ngày tiếp theo để có thời gian nghỉ và xử lý trễ.",
    });
  }

  if (categories.size <= 1 && stops.length >= 3) {
    insights.push({
      id: "variety",
      tone: "info",
      title: "Có thể làm hành trình đa dạng hơn",
      description: "Thêm một điểm ẩm thực, sinh thái hoặc văn hóa gần tuyến hiện tại.",
    });
  }

  const lateStops = stops.filter((stop) => stop.arrivalTime >= "17:30");
  if (lateStops.length > 0) {
    insights.push({
      id: "late",
      tone: "info",
      title: "Kiểm tra giờ đóng cửa",
      description: "Có điểm được xếp sau 17:30. Hãy xác nhận giờ hoạt động trước khi đi.",
    });
  }

  return insights;
}
