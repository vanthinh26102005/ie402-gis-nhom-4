export type ServiceFeatureProperties = {
  id: string;
  name: string;
  type: "hotel" | "restaurant" | "parking" | "medical" | "gas_station" | "other";
  provinceName: string;
  provinceCode: string;
  rating: string | number | null;
  address: string | null;
  phone: string | null;
  description: string | null;
};
