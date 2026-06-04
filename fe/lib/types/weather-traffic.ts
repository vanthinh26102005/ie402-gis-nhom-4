export type WeatherStatusLabel =
  | "Nắng ráo"
  | "Nắng nóng"
  | "Nhiều mây"
  | "Mưa rào"
  | "Mưa bão"
  | "Có sương mù";

export type CongestionLabel = "Thông thoáng" | "Chậm" | "Ùn tắc" | "Cấm đường";

export type WeatherInfo = {
  weather_id: string;
  destination_id?: string;
  destination_name?: string;
  province?: string;
  temperature: number;
  humidity: number;
  weather_status: WeatherStatusLabel;
  wind_speed: number;
  observed_at: string;
};

export type TrafficInfo = {
  traffic_id: string;
  destination_id?: string;
  destination_name?: string;
  province?: string;
  route_name?: string;
  congestion_level: CongestionLabel;
  status: string;
  description: string;
  observed_at: string;
};

export type TrafficAlert = {
  id: string;
  level: string;
  title: string;
  content: string;
  date: string;
};
