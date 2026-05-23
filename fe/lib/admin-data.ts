// Mock data types matching backend schemas

export interface TouristDestination {
  id: string;
  name: string;
  province: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  ticket_price: number;
  open_time: string;
  close_time: string;
  description: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at: string;
}

export interface ServiceFacility {
  id: string;
  name: string;
  type: "hotel" | "restaurant" | "parking" | "medical" | "toilet" | "atm" | "gas_station";
  province: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface DestinationCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  destinations_count: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "alert" | "promotion";
  destination_id?: string;
  destination_name?: string;
  status: "active" | "inactive" | "expired";
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  destination_id: string;
  destination_name: string;
  rating: number;
  content: string;
  status: "pending" | "approved" | "hidden" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface WeatherData {
  id: string;
  destination_id: string;
  destination_name: string;
  temperature: number;
  humidity: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "foggy";
  wind_speed: number;
  updated_at: string;
}

export interface TrafficData {
  id: string;
  road_name: string;
  congestion_level: "low" | "medium" | "high" | "blocked";
  description?: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

// Mock data
export const mockDestinations: TouristDestination[] = [
  {
    id: "dest-001",
    name: "Đại Nội Huế",
    province: "Huế",
    category: "Di sản",
    address: "Đường Đại Đồng, Phường Thuỷ Vân, TP. Huế",
    latitude: 16.4619,
    longitude: 107.5779,
    ticket_price: 150000,
    open_time: "07:00",
    close_time: "18:00",
    description: "Cố đô Huế với kiến trúc hoàng gia nguy nga",
    status: "active",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-03-20T14:30:00Z",
  },
  {
    id: "dest-002",
    name: "Phố cổ Hội An",
    province: "Đà Nẵng",
    category: "Di sản",
    address: "Đường Nguyễn Phúc, Phường Minh An, Hội An",
    latitude: 15.8801,
    longitude: 108.3385,
    ticket_price: 80000,
    open_time: "08:00",
    close_time: "21:00",
    description: "Phố cổ Hội An với kiến trúc truyền thống",
    status: "active",
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-03-18T10:00:00Z",
  },
  {
    id: "dest-003",
    name: "Bãi biển Mỹ Khê",
    province: "Đà Nẵng",
    category: "Biển đảo",
    address: "Đường Võ Nguyên Giáp, Phường Phước Mỹ, TP. Đà Nẵng",
    latitude: 16.0544,
    longitude: 108.2439,
    ticket_price: 0,
    open_time: "00:00",
    close_time: "23:59",
    description: "Một trong những bãi biển đẹp nhất thế giới",
    status: "active",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-03-15T08:00:00Z",
  },
  {
    id: "dest-004",
    name: "Thánh địa La Vang",
    province: "Quảng Trị",
    category: "Tâm linh",
    address: "Thị trấn La Vang, Huyện Hải Lăng, Quảng Trị",
    latitude: 16.5636,
    longitude: 107.2111,
    ticket_price: 0,
    open_time: "05:00",
    close_time: "21:00",
    description: "Địa điểm hành hương tâm linh lớn nhất miền Trung",
    status: "active",
    created_at: "2024-02-10T11:00:00Z",
    updated_at: "2024-03-10T09:00:00Z",
  },
  {
    id: "dest-005",
    name: "Đèo Hải Vân",
    province: "Huế",
    category: "Núi",
    address: "Quốc lộ 1A, ranh giới Huế - Đà Nẵng",
    latitude: 16.2014,
    longitude: 108.1064,
    ticket_price: 0,
    open_time: "00:00",
    close_time: "23:59",
    description: "Một trong những đèo đẹp nổi tiếng Việt Nam",
    status: "pending",
    created_at: "2024-03-01T08:00:00Z",
    updated_at: "2024-03-25T16:00:00Z",
  },
];

export const mockServices: ServiceFacility[] = [
  {
    id: "svc-001",
    name: "Khách sạn Pilgrimage Village",
    type: "hotel",
    province: "Huế",
    address: "130 Nguyễn Khoa Chiêm, P.崔文, TP. Huế",
    latitude: 16.4634,
    longitude: 107.5749,
    phone: "0234 388 6868",
    status: "active",
    created_at: "2024-01-10T08:00:00Z",
  },
  {
    id: "svc-002",
    name: "Nhà hàng Cơm Tấm Kiều Giang",
    type: "restaurant",
    province: "Đà Nẵng",
    address: "89 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu",
    latitude: 16.0541,
    longitude: 108.2222,
    phone: "0236 388 8888",
    status: "active",
    created_at: "2024-01-12T09:00:00Z",
  },
  {
    id: "svc-003",
    name: "Bãi đỗ xe Phố cổ Hội An",
    type: "parking",
    province: "Đà Nẵng",
    address: "Trần Hưng Đạo, P. Minh An, Hội An",
    latitude: 15.8776,
    longitude: 108.3294,
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "svc-004",
    name: "Bệnh viện Đa khoa Trung ương Huế",
    type: "medical",
    province: "Huế",
    address: "16 Lê Lợi, P. Vĩnh Ninh, TP. Huế",
    latitude: 16.4689,
    longitude: 107.5780,
    phone: "0234 382 6225",
    status: "active",
    created_at: "2024-01-18T11:00:00Z",
  },
  {
    id: "svc-005",
    name: "ATM VietinBank - Đại Nội",
    type: "atm",
    province: "Huế",
    address: "12 Đại Đồng, P. Thuỷ Vân, TP. Huế",
    latitude: 16.4620,
    longitude: 107.5780,
    status: "inactive",
    created_at: "2024-02-01T08:00:00Z",
  },
];

export const mockCategories: DestinationCategory[] = [
  {
    id: "cat-001",
    name: "Di sản",
    description: "Các di sản văn hóa, lịch sử được UNESCO công nhận",
    color: "#8b5cf6",
    destinations_count: 12,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "cat-002",
    name: "Biển đảo",
    description: "Bãi biển, đảo và các hoạt động biển",
    color: "#0ea5e9",
    destinations_count: 25,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "cat-003",
    name: "Núi",
    description: "Đỉnh núi, rừng và các điểm leo núi",
    color: "#22c55e",
    destinations_count: 8,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "cat-004",
    name: "Tâm linh",
    description: "Đền, chùa, nhà thờ và các địa điểm tâm linh",
    color: "#f59e0b",
    destinations_count: 15,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "cat-005",
    name: "Sinh thái",
    description: "Vườn quốc gia, khu bảo tồn thiên nhiên",
    color: "#10b981",
    destinations_count: 6,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "Đóng cửa Đại Nội Huế để bảo tồn",
    content: "Đại Nội Huế sẽ đóng cửa từ ngày 15/04 đến 20/04 để phục vụ công tác bảo tồn di sản.",
    type: "warning",
    destination_id: "dest-001",
    destination_name: "Đại Nội Huế",
    status: "active",
    start_date: "2024-04-10T00:00:00Z",
    end_date: "2024-04-25T23:59:00Z",
    created_at: "2024-04-01T08:00:00Z",
  },
  {
    id: "notif-002",
    title: "Lễ hội phố cổ Hội An 2024",
    content: "Lễ hội phố cổ Hội An diễn ra từ ngày 20/04 đến 25/04 với nhiều hoạt động văn hóa đặc sắc.",
    type: "promotion",
    destination_id: "dest-002",
    destination_name: "Phố cổ Hội An",
    status: "active",
    start_date: "2024-04-15T00:00:00Z",
    end_date: "2024-04-30T23:59:00Z",
    created_at: "2024-04-05T10:00:00Z",
  },
  {
    id: "notif-003",
    title: "Cảnh báo mưa lớn khu vực Miền Trung",
    content: "Dự báo mưa lớn trên diện rộng từ ngày 18/04. Du khách nên hạn chế di chuyển.",
    type: "alert",
    status: "active",
    start_date: "2024-04-16T00:00:00Z",
    end_date: "2024-04-20T23:59:00Z",
    created_at: "2024-04-16T06:00:00Z",
  },
  {
    id: "notif-004",
    title: "Thông tin hữu ích về Mỹ Khê",
    content: "Bãi biển Mỹ Khê được bình chọn trong top 10 bãi biển đẹp nhất châu Á.",
    type: "info",
    destination_id: "dest-003",
    destination_name: "Bãi biển Mỹ Khê",
    status: "inactive",
    start_date: "2024-03-01T00:00:00Z",
    end_date: "2024-03-31T23:59:00Z",
    created_at: "2024-02-28T08:00:00Z",
  },
];

export const mockReviews: Review[] = [
  {
    id: "rev-001",
    user_id: "user-001",
    user_name: "Nguyễn Văn Minh",
    destination_id: "dest-001",
    destination_name: "Đại Nội Huế",
    rating: 5,
    content: "Địa điểm tuyệt vời! Kiến trúc hoàng gia rất nguy nga và đẹp mắt. Nên đi vào buổi sáng sớm để tránh đông.",
    status: "approved",
    created_at: "2024-03-15T14:30:00Z",
    updated_at: "2024-03-15T16:00:00Z",
  },
  {
    id: "rev-002",
    user_id: "user-002",
    user_name: "Trần Thị Lan",
    destination_id: "dest-002",
    destination_name: "Phố cổ Hội An",
    rating: 4,
    content: "Phố cổ rất đẹp, đi lại thuận tiện. Tuy nhiên vào buổi tối khá đông, nên đi sớm hơn.",
    status: "approved",
    created_at: "2024-03-18T10:00:00Z",
    updated_at: "2024-03-18T12:00:00Z",
  },
  {
    id: "rev-003",
    user_id: "user-003",
    user_name: "Lê Hoàng Nam",
    destination_id: "dest-003",
    destination_name: "Bãi biển Mỹ Khê",
    rating: 2,
    content: "Bãi biển đẹp nhưng nước không trong lắm và có khá nhiều rác. Cần cải thiện vệ sinh.",
    status: "pending",
    created_at: "2024-03-20T09:00:00Z",
    updated_at: "2024-03-20T09:00:00Z",
  },
  {
    id: "rev-004",
    user_id: "user-004",
    user_name: "Phạm Thu Hà",
    destination_id: "dest-001",
    destination_name: "Đại Nội Huế",
    rating: 1,
    content: "DU KHÁCH TỐT NHẤT KHÔNG NÊN ĐẾN ĐÂY VÌ ĐÂY LÀ ĐỊA ĐIỂM CỦA BỌN PHẢN ĐỘNG",
    status: "pending",
    created_at: "2024-03-22T08:00:00Z",
    updated_at: "2024-03-22T08:00:00Z",
  },
  {
    id: "rev-005",
    user_id: "user-005",
    user_name: "Hoàng Đức Anh",
    destination_id: "dest-004",
    destination_name: "Thánh địa La Vang",
    rating: 5,
    content: "Nơi yên bình và tâm linh. Rất phù hợp để tìm lại sự bình yên trong tâm hồn.",
    status: "approved",
    created_at: "2024-03-19T11:00:00Z",
    updated_at: "2024-03-19T14:00:00Z",
  },
];

export const mockWeather: WeatherData[] = [
  {
    id: "weather-001",
    destination_id: "dest-001",
    destination_name: "Đại Nội Huế",
    temperature: 28,
    humidity: 75,
    condition: "cloudy",
    wind_speed: 12,
    updated_at: "2024-03-25T10:00:00Z",
  },
  {
    id: "weather-002",
    destination_id: "dest-002",
    destination_name: "Phố cổ Hội An",
    temperature: 31,
    humidity: 68,
    condition: "sunny",
    wind_speed: 8,
    updated_at: "2024-03-25T10:00:00Z",
  },
  {
    id: "weather-003",
    destination_id: "dest-003",
    destination_name: "Bãi biển Mỹ Khê",
    temperature: 30,
    humidity: 72,
    condition: "sunny",
    wind_speed: 15,
    updated_at: "2024-03-25T10:00:00Z",
  },
];

export const mockTraffic: TrafficData[] = [
  {
    id: "traffic-001",
    road_name: "Quốc lộ 1A - Đoạn qua Đà Nẵng",
    congestion_level: "high",
    description: "Kẹt xe nghiêm trọng do construction",
    latitude: 16.0544,
    longitude: 108.2133,
    updated_at: "2024-03-25T09:30:00Z",
  },
  {
    id: "traffic-002",
    road_name: "Đèo Hải Vân",
    congestion_level: "low",
    description: "Đường thông thoáng, tầm nhìn tốt",
    latitude: 16.2014,
    longitude: 108.1064,
    updated_at: "2024-03-25T09:30:00Z",
  },
  {
    id: "traffic-003",
    road_name: "Cầu Tràng Tiền, Huế",
    congestion_level: "medium",
    description: "Ùn ứ nhẹ vào giờ cao điểm",
    latitude: 16.4689,
    longitude: 107.5906,
    updated_at: "2024-03-25T09:30:00Z",
  },
];

// Dashboard stats
export const getDashboardStats = () => ({
  destinations: mockDestinations.length,
  services: mockServices.length,
  reviews: mockReviews.length,
  notifications: mockNotifications.filter((n) => n.status === "active").length,
  pendingReviews: mockReviews.filter((r) => r.status === "pending").length,
  activeDestinations: mockDestinations.filter((d) => d.status === "active").length,
});
