import type { REGION_PROVINCES } from "@/lib/constants";

export const MAP_LAYER_IDS = ["destinations", "services", "route"] as const;

export type MapLayerId = (typeof MAP_LAYER_IDS)[number];
export type RegionProvince = (typeof REGION_PROVINCES)[number];
export type MapCoordinate = [number, number];

export type MapLayer = {
  id: MapLayerId;
  label: string;
  description: string;
  color: string;
  geometry: "Point" | "Polyline";
  source: string;
  status: string;
};

export type MapPoint = {
  id: string;
  name: string;
  category: string;
  province: RegionProvince;
  layerId: Extract<MapLayerId, "destinations" | "services">;
  position: MapCoordinate;
  href: `/destinations/${string}`;
  description: string;
};

export const MAP_CENTER: MapCoordinate = [16.33, 107.66];
export const MAP_ZOOM = 8;

export const MAP_LAYERS: MapLayer[] = [
  {
    id: "destinations",
    label: "Điểm du lịch",
    description: "Các điểm tham quan chính trong phạm vi Quảng Trị - Huế - Đà Nẵng.",
    color: "#2563eb",
    geometry: "Point",
    source: "Dữ liệu mẫu FE",
    status: "Sẵn sàng hiển thị",
  },
  {
    id: "services",
    label: "Dịch vụ hỗ trợ",
    description: "Nhà ga, sân bay, lưu trú và dịch vụ tiện ích gần điểm du lịch.",
    color: "#059669",
    geometry: "Point",
    source: "Dữ liệu mẫu FE",
    status: "Sẵn sàng hiển thị",
  },
  {
    id: "route",
    label: "Tuyến kết nối",
    description: "Tuyến tham quan gợi ý nối các cụm điểm du lịch miền Trung.",
    color: "#dc2626",
    geometry: "Polyline",
    source: "Dữ liệu mẫu FE",
    status: "Sẵn sàng hiển thị",
  },
];

export const DEFAULT_LAYER_VISIBILITY: Record<MapLayerId, boolean> = {
  destinations: true,
  services: true,
  route: true,
};

export const MAP_POINTS: MapPoint[] = [
  {
    id: "hue-imperial-city",
    name: "Đại Nội Huế",
    category: "Di sản văn hóa",
    province: "Huế",
    layerId: "destinations",
    position: [16.4699, 107.5775],
    href: "/destinations/hue-imperial-city",
    description: "Quần thể di tích cố đô, phù hợp cho tuyến tham quan lịch sử.",
  },
  {
    id: "my-khe-beach",
    name: "Biển Mỹ Khê",
    category: "Du lịch biển",
    province: "Đà Nẵng",
    layerId: "destinations",
    position: [16.0611, 108.2478],
    href: "/destinations/my-khe-beach",
    description: "Bãi biển trung tâm Đà Nẵng, gần các dịch vụ lưu trú và ẩm thực.",
  },
  {
    id: "hien-luong-ben-hai",
    name: "Cầu Hiền Lương - sông Bến Hải",
    category: "Di tích lịch sử",
    province: "Quảng Trị",
    layerId: "destinations",
    position: [17.0002, 107.0538],
    href: "/destinations/hien-luong-ben-hai",
    description: "Điểm di tích lịch sử trên trục kết nối Bắc Trung Bộ.",
  },
  {
    id: "ba-na-hills",
    name: "Bà Nà Hills",
    category: "Khu du lịch",
    province: "Đà Nẵng",
    layerId: "destinations",
    position: [15.9972, 107.9885],
    href: "/destinations/ba-na-hills",
    description: "Khu du lịch núi với tuyến cáp treo và cụm dịch vụ tham quan.",
  },
  {
    id: "dong-hoi-hotel-cluster",
    name: "Cụm lưu trú ven biển Nhật Lệ",
    category: "Lưu trú",
    province: "Quảng Trị",
    layerId: "services",
    position: [16.8197, 107.1011],
    href: "/destinations/hien-luong-ben-hai",
    description: "Điểm dịch vụ mẫu phục vụ tuyến Quảng Trị và vùng lân cận.",
  },
  {
    id: "da-nang-airport",
    name: "Sân bay quốc tế Đà Nẵng",
    category: "Giao thông",
    province: "Đà Nẵng",
    layerId: "services",
    position: [16.0544, 108.2022],
    href: "/destinations/my-khe-beach",
    description: "Cửa ngõ giao thông cho các tuyến du lịch Đà Nẵng - Huế.",
  },
  {
    id: "hue-station",
    name: "Ga Huế",
    category: "Giao thông",
    province: "Huế",
    layerId: "services",
    position: [16.4563, 107.5789],
    href: "/destinations/hue-imperial-city",
    description: "Điểm trung chuyển gần cụm di sản trung tâm Huế.",
  },
];

export const TOURISM_ROUTE: MapCoordinate[] = [
  [17.0002, 107.0538],
  [16.8197, 107.1011],
  [16.4699, 107.5775],
  [16.4563, 107.5789],
  [16.0544, 108.2022],
  [16.0611, 108.2478],
  [15.9972, 107.9885],
];

export function getLayerPointCount(layerId: MapLayerId) {
  if (layerId === "route") {
    return TOURISM_ROUTE.length;
  }

  return MAP_POINTS.filter((point) => point.layerId === layerId).length;
}
