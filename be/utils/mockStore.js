const now = "2026-05-17T00:00:00.000Z";

const store = {
  categories: [
    {
      id: "cat-cultural",
      name: "Cultural",
      description: "Historic and cultural destinations.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "cat-nature",
      name: "Nature",
      description: "Natural attractions and outdoor experiences.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "cat-beach",
      name: "Beach",
      description: "Coastal tourism destinations.",
      createdAt: now,
      updatedAt: now,
    },
  ],
  destinations: [
    {
      id: "dest-hue-citadel",
      name: "Hue Imperial City",
      description: "UNESCO heritage complex in Hue.",
      address: "Phu Hau, Hue",
      openTime: "07:00",
      closeTime: "17:30",
      ticketPrice: 200000,
      imageUrl: "",
      videoUrl: "",
      rating: 4.7,
      location: { lat: 16.4692, lng: 107.5779 },
      provinceId: "province-hue",
      categoryId: "cat-cultural",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "dest-my-khe",
      name: "My Khe Beach",
      description: "Popular beach destination in Da Nang.",
      address: "Vo Nguyen Giap, Da Nang",
      openTime: "00:00",
      closeTime: "23:59",
      ticketPrice: 0,
      imageUrl: "",
      videoUrl: "",
      rating: 4.6,
      location: { lat: 16.0616, lng: 108.2469 },
      provinceId: "province-da-nang",
      categoryId: "cat-beach",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "dest-vinh-moc",
      name: "Vinh Moc Tunnels",
      description: "Historic tunnel system in Quang Tri.",
      address: "Vinh Thach, Quang Tri",
      openTime: "07:00",
      closeTime: "17:00",
      ticketPrice: 50000,
      imageUrl: "",
      videoUrl: "",
      rating: 4.5,
      location: { lat: 17.0897, lng: 107.1068 },
      provinceId: "province-quang-tri",
      categoryId: "cat-cultural",
      createdAt: now,
      updatedAt: now,
    },
  ],
  services: [
    {
      id: "svc-hue-hotel",
      name: "Hue Riverside Hotel",
      type: "hotel",
      address: "Le Loi, Hue",
      phone: "0900000001",
      rating: 4.4,
      description: "Hotel near central Hue.",
      location: { lat: 16.4667, lng: 107.5909 },
      provinceId: "province-hue",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "svc-da-nang-restaurant",
      name: "Da Nang Seafood",
      type: "restaurant",
      address: "Vo Nguyen Giap, Da Nang",
      phone: "0900000002",
      rating: 4.3,
      description: "Seafood restaurant near My Khe.",
      location: { lat: 16.0638, lng: 108.2464 },
      provinceId: "province-da-nang",
      createdAt: now,
      updatedAt: now,
    },
  ],
  tours: [
    {
      id: "tour-central-heritage",
      userId: "u1",
      title: "Central Heritage Trip",
      description: "Hue and Quang Tri historical route.",
      totalDistance: 145,
      estimatedDuration: "2 days",
      destinations: ["dest-hue-citadel", "dest-vinh-moc"],
      createdAt: now,
      updatedAt: now,
    },
  ],
  reviews: [
    {
      id: "rev-hue-1",
      userId: "u1",
      destinationId: "dest-hue-citadel",
      content: "Clear route and rich historical context.",
      score: 5,
      status: "approved",
      createdAt: now,
      updatedAt: now,
    },
  ],
  notifications: [
    {
      id: "noti-hue-1",
      destinationId: "dest-hue-citadel",
      title: "Maintenance notice",
      content: "Some areas may be temporarily closed.",
      type: "maintenance",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ],
  weather: [
    {
      id: "weather-hue-1",
      destinationId: "dest-hue-citadel",
      temperature: 31,
      humidity: 72,
      weatherStatus: "cloudy",
      windSpeed: 10,
      location: { lat: 16.4692, lng: 107.5779 },
      observedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ],
  traffic: [
    {
      id: "traffic-da-nang-1",
      destinationId: "dest-my-khe",
      congestionLevel: "medium",
      status: "slow",
      description: "Weekend traffic near beach access roads.",
      location: { lat: 16.0616, lng: 108.2469 },
      observedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ],
};

const counters = {};

export function getCollection(name) {
  return store[name] || [];
}

export function getTimestamp() {
  return new Date().toISOString();
}

export function createId(prefix) {
  counters[prefix] = (counters[prefix] || 0) + 1;
  return `${prefix}-${Date.now()}-${counters[prefix]}`;
}
