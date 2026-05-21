export interface LocationGeom {
  lat: number;
  lng: number;
}

export interface TouristDestination {
  destination_id: string;
  name: string;
  description: string;
  address: string;
  open_time: string;
  close_time: string;
  ticket_price: number;
  image_url: string;
  video_url?: string;
  rating: number;
  location_geom: LocationGeom;
  province_id: "Quảng Trị" | "Huế" | "Đà Nẵng";
  category_id: "Di sản" | "Sinh thái" | "Du lịch biển" | "Giải trí";
  created_at: string;
  updated_at: string;
}

export interface Review {
  review_id: string;
  user_name: string;
  destination_id: string;
  content: string;
  score: number; // 1 to 5 stars
  created_at: string;
}

export interface WeatherInfo {
  weather_id: string;
  destination_id?: string;
  province?: string;
  temperature: number;
  humidity: number;
  weather_status: "Nắng ráo" | "Nhiều mây" | "Mưa rào" | "Mưa bão" | "Có sương mù" | "Nắng nóng";
  wind_speed: number; // km/h
  observed_at: string;
}

export interface TrafficInfo {
  traffic_id: string;
  destination_id?: string;
  route_name?: string;
  congestion_level: "Thông thoáng" | "Chậm" | "Ùn tắc" | "Cấm đường";
  status: string;
  description: string;
  observed_at: string;
}

export interface RouteSummary {
  start_destination_name: string;
  end_destination_name: string;
  total_distance: number; // km
  estimated_duration: number; // minutes
  traffic_status: string;
  steps: string[];
}

// -------------------------------------------------------------
// MOCK DATASETS
// -------------------------------------------------------------

export const MOCK_DESTINATIONS: TouristDestination[] = [
  {
    destination_id: "thanh-co-quang-tri",
    name: "Thành Cổ Quảng Trị",
    description: "Thành Cổ Quảng Trị là một di tích quốc gia đặc biệt, nơi đã diễn ra cuộc chiến đấu 81 ngày đêm oanh liệt mùa hè đỏ lửa năm 1972. Nơi đây được ví như một nghĩa trang không bia mộ, biểu tượng cho lòng yêu nước và ý chí quật cường của quân dân Việt Nam.",
    address: "Đường Trí Bưu, Phường 2, Thị xã Quảng Trị, Tỉnh Quảng Trị",
    open_time: "07:00",
    close_time: "17:00",
    ticket_price: 0, // Miễn phí vé vào cổng
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Th%C3%A0nh_c%E1%BB%95_Qu%E1%BA%A3ng_Tr%E1%BB%8B_4.jpg/960px-Th%C3%A0nh_c%E1%BB%95_Qu%E1%BA%A3ng_Tr%E1%BB%8B_4.jpg",
    video_url: "https://www.youtube.com/embed/fQeX76mZf1M",
    rating: 4.8,
    location_geom: { lat: 16.751672, lng: 107.186772 },
    province_id: "Quảng Trị",
    category_id: "Di sản",
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-21T10:00:00Z",
  },
  {
    destination_id: "dia-dao-vinh-moc",
    name: "Địa đạo Vịnh Mốc",
    description: "Công trình kiến trúc đường hầm ngầm độc đáo trong lòng đất phục vụ chiến đấu và sinh hoạt của hàng trăm người dân Vịnh Mốc trong thời kỳ kháng chiến chống Mỹ cứu nước từ năm 1965 đến 1972.",
    address: "Xã Kim Thạch, Huyện Vĩnh Linh, Tỉnh Quảng Trị",
    open_time: "07:30",
    close_time: "17:00",
    ticket_price: 50000,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/3/31/Using_bomb_fragment_as_a_smart_to_alert_everybody.JPG",
    video_url: "https://www.youtube.com/embed/BjyJD6BuAQM",
    rating: 4.7,
    location_geom: { lat: 17.07427, lng: 107.10979 },
    province_id: "Quảng Trị",
    category_id: "Di sản",
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-21T10:00:00Z",
  },
  {
    destination_id: "dai-noi-hue",
    name: "Đại Nội Huế (Hoàng Cung Huế)",
    description: "Quần thể kiến trúc cung điện nguy nga, di sản văn hóa thế giới UNESCO, từng là trung tâm hành chính và nơi sinh sống của 13 vị vua triều Nguyễn - triều đại phong kiến cuối cùng của Việt Nam.",
    address: "Đường 23/8, Phường Thuận Hòa, Thành phố Huế, Tỉnh Thừa Thiên Huế",
    open_time: "08:00",
    close_time: "17:30",
    ticket_price: 200000,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Du_kh%C3%A1ch_vi%E1%BA%BFng_th%C4%83m_L%E1%BA%A7u_Ng%C5%A9_Ph%E1%BB%A5ng.JPG/960px-Du_kh%C3%A1ch_vi%E1%BA%BFng_th%C4%83m_L%E1%BA%A7u_Ng%C5%A9_Ph%E1%BB%A5ng.JPG",
    video_url: "https://www.youtube.com/embed/RAPiXBjs0Cw",
    rating: 4.9,
    location_geom: { lat: 16.470231, lng: 107.577251 },
    province_id: "Huế",
    category_id: "Di sản",
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-21T10:00:00Z",
  },
  {
    destination_id: "lang-tu-duc",
    name: "Lăng Tự Đức (Khiêm Lăng)",
    description: "Được mệnh danh là một trong những công trình kiến trúc đẹp nhất của triều Nguyễn, Khiêm Lăng mang vẻ đẹp thơ mộng, trữ tình với hồ nước, rừng thông, phản ánh tâm hồn thi sĩ của vị hoàng đế triều Nguyễn.",
    address: "Thôn Thượng Ba, Phường Thủy Xuân, Thành phố Huế, Tỉnh Thừa Thiên Huế",
    open_time: "07:30",
    close_time: "17:00",
    ticket_price: 150000,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Annam_-_Hu%C3%A9_-_Pavillons_sur_le_bassin_fleuri_au_Tombeau_de_Tu-Duc.jpg/960px-Annam_-_Hu%C3%A9_-_Pavillons_sur_le_bassin_fleuri_au_Tombeau_de_Tu-Duc.jpg",
    video_url: "https://www.youtube.com/embed/4hGdhW67fm8",
    rating: 4.6,
    location_geom: { lat: 16.43256, lng: 107.56581 },
    province_id: "Huế",
    category_id: "Di sản",
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-21T10:00:00Z",
  },
  {
    destination_id: "ngu-hanh-son",
    name: "Danh thắng Ngũ Hành Sơn",
    description: "Nhóm 5 ngọn núi đá vôi nhô lên giữa bãi cát ven biển gồm Kim Sơn, Mộc Sơn, Thủy Sơn, Hỏa Sơn và Thổ Sơn. Danh thắng nổi tiếng với cảnh sắc kỳ vĩ, hang động huyền bí và các ngôi chùa cổ tự linh thiêng.",
    address: "81 Huyền Trân Công Chúa, Phường Hòa Hải, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
    open_time: "07:00",
    close_time: "17:30",
    ticket_price: 40000,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Ngu_hanh_son_toan_canh.jpg/960px-Ngu_hanh_son_toan_canh.jpg",
    video_url: "https://www.youtube.com/embed/VbgTWBFBBlE",
    rating: 4.5,
    location_geom: { lat: 16.0083, lng: 108.2525 },
    province_id: "Đà Nẵng",
    category_id: "Sinh thái",
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-21T10:00:00Z",
  },
  {
    destination_id: "ban-dao-son-tra",
    name: "Bán đảo Sơn Trà & Chùa Linh Ứng",
    description: "Được ví như 'lá phổi xanh' của Đà Nẵng, nơi sở hữu hệ sinh thái rừng tự nhiên đa dạng cùng rạn san hô đẹp mắt. Điểm nhấn tâm linh nổi bật là Chùa Linh Ứng Bãi Bụt với tượng Phật Bà Quan Thế Âm cao nhất Việt Nam (67m).",
    address: "Bán đảo Sơn Trà, Phường Thọ Quang, Quận Sơn Trà, Thành phố Đà Nẵng",
    open_time: "06:00",
    close_time: "21:00",
    ticket_price: 0,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Ban_dao_Son_Tra.jpg/960px-Ban_dao_Son_Tra.jpg",
    video_url: "https://www.youtube.com/embed/wrRcm1vRLTY",
    rating: 4.8,
    location_geom: { lat: 16.099683, lng: 108.277559 },
    province_id: "Đà Nẵng",
    category_id: "Du lịch biển",
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-21T10:00:00Z",
  },
  {
    destination_id: "ba-na-hills",
    name: "Sun World Ba Na Hills",
    description: "Khu du lịch sinh thái kết hợp vui chơi giải trí đẳng cấp châu Âu nằm trên đỉnh núi Chúa. Nổi tiếng toàn cầu với công trình Cầu Vàng (Golden Bridge) ấn tượng nâng đỡ bởi hai bàn tay khổng lồ giữa màn sương mờ ảo.",
    address: "Thôn An Sơn, Xã Hòa Ninh, Huyện Hòa Vang, Thành phố Đà Nẵng",
    open_time: "07:30",
    close_time: "21:30",
    ticket_price: 900000,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/The_Golden_Bridge%2C_Ba_Na_Hills%2C_Vietnam.jpg/960px-The_Golden_Bridge%2C_Ba_Na_Hills%2C_Vietnam.jpg",
    video_url: "https://www.youtube.com/embed/K5vfzGUBfXg",
    rating: 4.9,
    location_geom: { lat: 15.99486, lng: 107.99625 },
    province_id: "Đà Nẵng",
    category_id: "Giải trí",
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-21T10:00:00Z",
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    review_id: "rev-1",
    user_name: "Nguyễn Văn Hùng",
    destination_id: "thanh-co-quang-tri",
    content: "Nơi tôn nghiêm và xúc động vô cùng. Không gian yên tĩnh, cỏ xanh mướt, đài tưởng niệm lung linh khói hương. Rất khuyến khích mọi người đến dâng hương bày tỏ lòng biết ơn.",
    score: 5,
    created_at: "2026-05-15T09:30:00Z",
  },
  {
    review_id: "rev-2",
    user_name: "Trần Thị Lan",
    destination_id: "thanh-co-quang-tri",
    content: "Một di tích lịch sử linh thiêng, có hướng dẫn viên tại điểm thuyết minh rất hay và xúc động.",
    score: 5,
    created_at: "2026-05-18T14:20:00Z",
  },
  {
    review_id: "rev-3",
    user_name: "David Smith",
    destination_id: "dai-noi-hue",
    content: "Breathtaking complex with immense historical value. It took me almost half a day to explore. Make sure to rent an audio guide or hire a local tour guide to understand the details.",
    score: 5,
    created_at: "2026-05-10T10:15:00Z",
  },
  {
    review_id: "rev-4",
    user_name: "Lê Minh Tuấn",
    destination_id: "dai-noi-hue",
    content: "Đại Nội rất đẹp và rộng lớn, đang trùng tu một số khu vực nên đi bộ hơi bụi một chút. Nên mua vé gộp để tham quan các lăng vua Nguyễn sẽ tiết kiệm hơn.",
    score: 4,
    created_at: "2026-05-20T16:45:00Z",
  },
  {
    review_id: "rev-5",
    user_name: "Phạm Thanh Thảo",
    destination_id: "lang-tu-duc",
    content: "Lăng thơ mộng và yên bình nhất trong các lăng. Có hồ nước mát mẻ, rừng thông xào xạc. Kiến trúc Khiêm Lăng thực sự rất tinh tế.",
    score: 5,
    created_at: "2026-05-12T08:10:00Z",
  },
  {
    review_id: "rev-6",
    user_name: "Hoàng Ngọc Sơn",
    destination_id: "ngu-hanh-son",
    content: "Hệ thống động huyền bí, leo bộ mệt nhưng cảnh quan trên đỉnh Thủy Sơn nhìn ra biển rất xứng đáng. Giá vé rẻ, phù hợp gia đình.",
    score: 4,
    created_at: "2026-05-17T11:30:00Z",
  },
  {
    review_id: "rev-7",
    user_name: "Vũ Hải Đăng",
    destination_id: "ban-dao-son-tra",
    content: "Chùa Linh Ứng rất thanh tịnh, tượng Phật Quan Âm khổng lồ nhìn từ xa cực kỳ tráng lệ. Trên đường đi Sơn Trà còn thấy cả khỉ hoang rất dễ thương.",
    score: 5,
    created_at: "2026-05-19T15:00:00Z",
  },
  {
    review_id: "rev-8",
    user_name: "Emily Watson",
    destination_id: "ba-na-hills",
    content: "Golden Bridge is stunning, but it was incredibly crowded. The French village on top is nice, but a bit commercialized. The cable car ride is outstanding!",
    score: 4,
    created_at: "2026-05-14T09:00:00Z",
  }
];

export const MOCK_WEATHER: WeatherInfo[] = [
  {
    weather_id: "w-qt",
    province: "Quảng Trị",
    temperature: 31,
    humidity: 78,
    weather_status: "Nắng ráo",
    wind_speed: 12,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-hue",
    province: "Huế",
    temperature: 29,
    humidity: 82,
    weather_status: "Nhiều mây",
    wind_speed: 8,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-dn",
    province: "Đà Nẵng",
    temperature: 32,
    humidity: 74,
    weather_status: "Nắng nóng",
    wind_speed: 14,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-thanhco",
    destination_id: "thanh-co-quang-tri",
    temperature: 31,
    humidity: 78,
    weather_status: "Nắng ráo",
    wind_speed: 12,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-vinhmoc",
    destination_id: "dia-dao-vinh-moc",
    temperature: 30,
    humidity: 80,
    weather_status: "Nắng ráo",
    wind_speed: 16,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-dainoi",
    destination_id: "dai-noi-hue",
    temperature: 29,
    humidity: 82,
    weather_status: "Nhiều mây",
    wind_speed: 8,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-tuduc",
    destination_id: "lang-tu-duc",
    temperature: 29,
    humidity: 82,
    weather_status: "Nhiều mây",
    wind_speed: 6,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-nguhanhson",
    destination_id: "ngu-hanh-son",
    temperature: 32,
    humidity: 74,
    weather_status: "Nắng nóng",
    wind_speed: 10,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-sontra",
    destination_id: "ban-dao-son-tra",
    temperature: 30,
    humidity: 79,
    weather_status: "Nắng ráo",
    wind_speed: 18,
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    weather_id: "w-banahills",
    destination_id: "ba-na-hills",
    temperature: 22,
    humidity: 90,
    weather_status: "Có sương mù",
    wind_speed: 15,
    observed_at: "2026-05-21T15:00:00Z"
  }
];

export const MOCK_TRAFFIC: TrafficInfo[] = [
  {
    traffic_id: "t-1",
    route_name: "Quốc lộ 1A (đoạn tránh TP. Đông Hà)",
    congestion_level: "Thông thoáng",
    status: "Đang lưu thông bình thường",
    description: "Đường khô ráo, phương tiện lưu thông ổn định, không có chướng ngại vật hay công trường thi công.",
    observed_at: "2026-05-21T15:30:00Z"
  },
  {
    traffic_id: "t-2",
    route_name: "Đèo Hải Vân (Thừa Thiên Huế - Đà Nẵng)",
    congestion_level: "Chậm",
    status: "Mương mờ hạn chế tầm nhìn",
    description: "Khu vực đỉnh đèo xuất hiện sương mù nhẹ về chiều tối, các phương tiện cần chú ý giảm tốc độ và bật đèn sương mù.",
    observed_at: "2026-05-21T15:45:00Z"
  },
  {
    traffic_id: "t-3",
    route_name: "Cầu Rồng (Đường Nguyễn Văn Linh, Đà Nẵng)",
    congestion_level: "Ùn tắc",
    status: "Mật độ phương tiện tăng cao đột biến",
    description: "Ùn ứ cục bộ vào giờ cao điểm chiều tối. Giao thông di chuyển rất chậm, khuyến cáo di chuyển sang cầu Trần Thị Lý hoặc cầu Sông Hàn.",
    observed_at: "2026-05-21T16:00:00Z"
  },
  {
    traffic_id: "t-4",
    destination_id: "dai-noi-hue",
    congestion_level: "Chậm",
    status: "Đường 23/8 quanh Hoàng thành đông đúc",
    description: "Mật độ xe du lịch và xe điện phục vụ khách tăng mạnh vào khung giờ tham quan xế chiều.",
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    traffic_id: "t-5",
    destination_id: "thanh-co-quang-tri",
    congestion_level: "Thông thoáng",
    status: "Lưu thông bình thường",
    description: "Khu vực quanh di tích Thành Cổ đường thông thoáng, xe ô tô khách ra vào thuận lợi.",
    observed_at: "2026-05-21T15:00:00Z"
  },
  {
    traffic_id: "t-6",
    destination_id: "ba-na-hills",
    congestion_level: "Chậm",
    status: "Hàng đợi cáp treo đông",
    description: "Lượng khách đổ về ga đi cáp treo đông đúc vào buổi sáng cuối tuần, thời gian chờ khoảng 15-20 phút.",
    observed_at: "2026-05-21T09:00:00Z"
  }
];

export const MOCK_TRAFFIC_ALERTS = [
  {
    id: "alert-1",
    level: "Cảnh báo",
    title: "Sương mù cục bộ trên đèo Hải Vân",
    content: "Khuyến cáo các tài xế lưu thông qua đèo Hải Vân vào buổi tối và sáng sớm cần chú ý tầm nhìn xa dưới 20m. Vui lòng giữ khoảng cách an toàn và đi đúng làn đường.",
    date: "2026-05-21"
  },
  {
    id: "alert-2",
    level: "Cấm đường",
    title: "Phun lửa Cầu Rồng cuối tuần",
    content: "Tạm thời cấm lưu thông qua Cầu Rồng từ 20:45 đến 21:15 vào các ngày Thứ Bảy và Chủ Nhật hàng tuần để phục vụ sự kiện Cầu Rồng phun lửa, phun nước.",
    date: "2026-05-21"
  }
];
