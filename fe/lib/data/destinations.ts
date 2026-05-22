export type Destination = {
  id: string;
  name: string;
  province: string;
  category: string;
};

/** Mock — thay bằng API TouristDestination khi backend sẵn sàng. */
export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "hue-citadel",
    name: "Đại Nội Huế",
    province: "Huế",
    category: "Di sản văn hóa",
  },
  {
    id: "thien-mu",
    name: "Chùa Thiên Mụ",
    province: "Huế",
    category: "Tâm linh",
  },
  {
    id: "quang-tri-citadel",
    name: "Thành cổ Quảng Trị",
    province: "Quảng Trị",
    category: "Di tích lịch sử",
  },
  {
    id: "hien-luong",
    name: "Cầu Hiền Lương – Sông Bến Hải",
    province: "Quảng Trị",
    category: "Di tích lịch sử",
  },
  {
    id: "marble-mountains",
    name: "Ngũ Hành Sơn",
    province: "Đà Nẵng",
    category: "Danh lam thắng cảnh",
  },
  {
    id: "my-khe",
    name: "Bãi biển Mỹ Khê",
    province: "Đà Nẵng",
    category: "Biển đảo",
  },
  {
    id: "ba-na",
    name: "Bà Nà Hills",
    province: "Đà Nẵng",
    category: "Vui chơi giải trí",
  },
  {
    id: "lang-co",
    name: "Biển Lăng Cô",
    province: "Huế",
    category: "Biển đảo",
  },
];

export function getDestinationById(id: string): Destination | undefined {
  return MOCK_DESTINATIONS.find((d) => d.id === id);
}
