import {
  MOCK_DESTINATIONS,
  MOCK_REVIEWS,
  MOCK_WEATHER,
  MOCK_TRAFFIC,
  MOCK_TRAFFIC_ALERTS,
  TouristDestination,
  Review,
  WeatherInfo,
  TrafficInfo,
  RouteSummary,
} from "./mockData";

// Simulate network latency (200ms - 500ms)
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDestinations(filters?: {
  keyword?: string;
  province?: string;
  category?: string;
}): Promise<TouristDestination[]> {
  await delay(400);
  let results = [...MOCK_DESTINATIONS];

  if (filters) {
    const { keyword, province, category } = filters;

    if (keyword && keyword.trim() !== "") {
      const cleanKeyword = keyword.toLowerCase().trim();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(cleanKeyword) ||
          d.description.toLowerCase().includes(cleanKeyword) ||
          d.address.toLowerCase().includes(cleanKeyword)
      );
    }

    if (province && province !== "") {
      results = results.filter((d) => d.province_id === province);
    }

    if (category && category !== "") {
      results = results.filter((d) => d.category_id === category);
    }
  }

  return results;
}

export async function getDestinationById(id: string): Promise<TouristDestination | null> {
  await delay(250);
  const dest = MOCK_DESTINATIONS.find((d) => d.destination_id === id);
  return dest || null;
}

export async function getReviews(destinationId: string): Promise<Review[]> {
  await delay(300);
  return MOCK_REVIEWS.filter((r) => r.destination_id === destinationId);
}

// Global in-memory reviews to persist additions during page lifetime
const localReviews = [...MOCK_REVIEWS];

export async function addReview(
  destinationId: string,
  review: { user_name: string; content: string; score: number }
): Promise<Review> {
  await delay(400);
  const newReview: Review = {
    review_id: `rev-local-${Date.now()}`,
    destination_id: destinationId,
    user_name: review.user_name || "Khách ẩn danh",
    content: review.content,
    score: review.score,
    created_at: new Date().toISOString(),
  };

  localReviews.unshift(newReview);

  // Recalculate average rating of the destination
  const dest = MOCK_DESTINATIONS.find((d) => d.destination_id === destinationId);
  if (dest) {
    const reviewsForDest = localReviews.filter((r) => r.destination_id === destinationId);
    const sum = reviewsForDest.reduce((acc, curr) => acc + curr.score, 0);
    dest.rating = Math.round((sum / reviewsForDest.length) * 10) / 10;
  }

  return newReview;
}

// Allow getting reviews including locally added ones
export async function getReviewsWithLocal(destinationId: string): Promise<Review[]> {
  await delay(200);
  return localReviews.filter((r) => r.destination_id === destinationId);
}

export async function getWeather(destinationId: string): Promise<WeatherInfo | null> {
  await delay(200);
  const weather = MOCK_WEATHER.find((w) => w.destination_id === destinationId);
  if (weather) return weather;

  // Fallback to province weather
  const dest = MOCK_DESTINATIONS.find((d) => d.destination_id === destinationId);
  if (dest) {
    const provWeather = MOCK_WEATHER.find((w) => w.province === dest.province_id);
    if (provWeather) return provWeather;
  }

  return null;
}

export async function getTraffic(destinationId: string): Promise<TrafficInfo | null> {
  await delay(200);
  const traffic = MOCK_TRAFFIC.find((t) => t.destination_id === destinationId);
  if (traffic) return traffic;

  return {
    traffic_id: "t-default",
    congestion_level: "Thông thoáng",
    status: "Bình thường",
    description: "Không ghi nhận ùn tắc hay sự cố quanh điểm du lịch này.",
    observed_at: new Date().toISOString(),
  };
}

export async function getRoute(startId: string, endId: string): Promise<RouteSummary | null> {
  await delay(500);
  const startDest = MOCK_DESTINATIONS.find((d) => d.destination_id === startId);
  const endDest = MOCK_DESTINATIONS.find((d) => d.destination_id === endId);

  if (!startDest || !endDest) return null;

  // Calculate distance using simple Euclidean formula mapped to km
  const dx = (startDest.location_geom.lng - endDest.location_geom.lng) * 111 * Math.cos((startDest.location_geom.lat * Math.PI) / 180);
  const dy = (startDest.location_geom.lat - endDest.location_geom.lat) * 111;
  const distance = Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;

  // Estimate duration at an average of 50 km/h + 5 mins overhead
  const duration = Math.round((distance / 50) * 60 + 5);

  // Determine traffic on route
  let trafficStatus = "Giao thông ổn định, lộ trình thông thoáng.";
  const hasSlowSegment = MOCK_TRAFFIC.some(
    (t) =>
      t.congestion_level !== "Thông thoáng" &&
      (t.destination_id === startId || t.destination_id === endId || t.route_name?.includes("Hải Vân"))
  );
  if (hasSlowSegment) {
    trafficStatus = "Ghi nhận có đoạn di chuyển chậm trên tuyến (Đèo Hải Vân hoặc khu nội thành).";
  }

  // Steps generator
  const steps: string[] = [
    `Xuất phát tại ${startDest.name} (${startDest.address}).`,
    `Đi về hướng Đông Nam theo tuyến đường chính nối ra quốc lộ liên tỉnh.`,
  ];

  if (startDest.province_id !== endDest.province_id) {
    steps.push(
      `Di chuyển dọc theo Quốc lộ 1A qua ranh giới hành chính giữa ${startDest.province_id} và ${endDest.province_id}.`
    );
    if (
      (startDest.province_id === "Huế" && endDest.province_id === "Đà Nẵng") ||
      (startDest.province_id === "Đà Nẵng" && endDest.province_id === "Huế")
    ) {
      steps.push(
        "Lựa chọn di chuyển qua Hầm đường bộ Hải Vân để tối ưu thời gian hoặc đi đường Đèo Hải Vân để ngắm cảnh."
      );
    }
  } else {
    steps.push(`Tiếp tục di chuyển trên các tuyến đường thuộc địa phận tỉnh/thành ${startDest.province_id}.`);
  }

  steps.push(`Rẽ vào đường tiếp cận của điểm đến mục tiêu.`);
  steps.push(`Đến nơi tại ${endDest.name} (${endDest.address}).`);

  return {
    start_destination_name: startDest.name,
    end_destination_name: endDest.name,
    total_distance: distance,
    estimated_duration: duration,
    traffic_status: trafficStatus,
    steps,
  };
}

export async function getAllWeather(): Promise<WeatherInfo[]> {
  await delay(200);
  return MOCK_WEATHER;
}

export async function getAllTraffic(): Promise<TrafficInfo[]> {
  await delay(200);
  return MOCK_TRAFFIC;
}

export async function getTrafficAlerts(): Promise<typeof MOCK_TRAFFIC_ALERTS> {
  await delay(150);
  return MOCK_TRAFFIC_ALERTS;
}

