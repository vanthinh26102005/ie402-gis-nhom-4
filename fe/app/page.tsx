"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CloudSun,
  Compass,
  Map,
  MapPin,
  Navigation,
  Search,
  Star,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { UserLayout } from "@/components/layout/UserLayout";

const heroPhotos = [
  {
    title: "Kinh thành Huế",
    meta: "Di sản · 4.8",
    image: "https://images.unsplash.com/photo-1567272131881-8ce2275deb67?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Bà Nà Hills",
    meta: "Núi & cáp treo · 4.5",
    image: "https://images.unsplash.com/photo-1747137129095-b693a7ad08d0?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Mỹ Khê",
    meta: "Biển đô thị · 4.7",
    image: "https://images.unsplash.com/photo-1708776480405-7ae14fe1d4c4?auto=format&fit=crop&w=900&q=85",
  },
];

const features = [
  {
    title: "Bản đồ GIS 2D",
    desc: "Xem điểm du lịch, lớp dịch vụ và vị trí trên nền bản đồ tương tác.",
    href: "/map",
    icon: Map,
  },
  {
    title: "Điểm du lịch",
    desc: "Tra cứu hình ảnh, giá vé, đánh giá và tọa độ từ dữ liệu thật.",
    href: "/destinations",
    icon: Compass,
  },
  {
    title: "Chỉ đường",
    desc: "Tính tuyến đi, khoảng cách và thời gian giữa các điểm tham quan.",
    href: "/route",
    icon: Navigation,
  },
  {
    title: "Thời tiết & giao thông",
    desc: "Theo dõi điều kiện thực địa để quyết định thời điểm di chuyển.",
    href: "/weather-traffic",
    icon: CloudSun,
  },
  {
    title: "Tạo tour",
    desc: "Lưu hành trình cá nhân vào tài khoản với thứ tự điểm đến rõ ràng.",
    href: "/tours/create",
    icon: CalendarDays,
  },
];

const provincesData = [
  { name: "Đà Nẵng", count: "5 điểm đến", category: "Biển · Núi · Giải trí" },
  { name: "Huế", count: "5 điểm đến", category: "Di sản · Lăng tẩm · Sông Hương" },
  { name: "TP.HCM", count: "6 điểm đến", category: "Kiến trúc · Lịch sử · Đô thị" },
  { name: "Hà Nội", count: "5 điểm đến", category: "Văn hóa · Hồ · Bảo tàng" },
  { name: "Sơn Trà", count: "Tuyến gợi ý", category: "Sinh thái · Viewpoint" },
  { name: "Trung tâm", count: "Tuyến đi bộ", category: "Dịch vụ gần điểm đến" },
];

export default function HomePage() {
  return (
    <UserLayout>
      <section className="grid gap-8 pb-14 pt-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-brand-outline-variant px-4 py-2 text-sm font-medium text-[#6a6a6a]">
            WebGIS du lịch 2D · dữ liệu PostGIS
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-[28px] font-bold leading-[1.43] tracking-normal text-brand-secondary md:text-[32px]">
              Cảm hứng cho những hành trình du lịch Việt Nam sắp tới
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#3f3f3f]">
              Khám phá điểm đến, xem điều kiện thời tiết/giao thông và lưu tour cá nhân
              trên một giao diện bản đồ nhẹ, rõ ràng, ưu tiên hình ảnh thật.
            </p>
          </div>

          <div className="flex min-h-16 max-w-2xl items-center rounded-full border border-brand-outline-variant bg-white p-2 shadow-[var(--shadow-brand-map)]">
            <Link
              href="/destinations"
              className="min-w-0 flex-1 rounded-full px-5 py-2 transition-[background-color] hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20"
            >
              <span className="block text-xs font-semibold text-brand-secondary">Bạn muốn đi đâu?</span>
              <span className="block truncate text-sm text-[#6a6a6a]">
                Tìm điểm du lịch, tỉnh thành hoặc loại hình…
              </span>
            </Link>
            <div className="hidden h-8 w-px bg-brand-outline-variant sm:block" />
            <Link
              href="/route"
              className="hidden min-w-0 flex-1 rounded-full px-5 py-2 transition-[background-color] hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20 sm:block"
            >
              <span className="block text-xs font-semibold text-brand-secondary">Khi nào đi?</span>
              <span className="block truncate text-sm text-[#6a6a6a]">Xem thời tiết và tuyến di chuyển</span>
            </Link>
            <Button asChild className="grid size-12 rounded-full p-0">
              <Link href="/map" aria-label="Mở bản đồ">
                <Search className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {heroPhotos.map((photo, index) => (
            <article
              key={photo.title}
              className="group min-w-0"
              style={{ marginTop: index === 1 ? "40px" : index === 2 ? "16px" : 0 }}
            >
              <div
                className="aspect-[4/5] overflow-hidden rounded-brand-card bg-brand-surface-container bg-cover bg-center"
                style={{ backgroundImage: `url(${photo.image})` }}
                aria-label={photo.title}
                role="img"
              />
              <div className="mt-3 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="truncate text-base font-semibold text-brand-secondary">
                    {photo.title}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-secondary">
                    <Star className="size-3.5 fill-brand-secondary text-brand-secondary" aria-hidden="true" />
                    {photo.meta.split(" · ")[1]}
                  </span>
                </div>
                <p className="truncate text-sm text-[#6a6a6a]">{photo.meta.split(" · ")[0]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-brand-outline-variant py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[22px] font-medium leading-tight tracking-normal text-brand-secondary">
              Công cụ cho chuyến đi
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6a6a6a]">
              Ít màu trang trí, nhiều tín hiệu hữu ích: vị trí, tuyến đi, rủi ro di chuyển và dữ liệu vận hành.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/map">
              Mở Bản Đồ
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group flex min-h-44 flex-col justify-between rounded-brand-card border border-brand-outline-variant bg-white p-5 transition-[box-shadow,border-color] hover:border-brand-secondary hover:shadow-[var(--shadow-brand-map)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20"
              >
                <div className="space-y-4">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-surface-low text-brand-secondary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-brand-secondary">{feature.title}</h3>
                    <p className="line-clamp-3 text-sm leading-6 text-[#6a6a6a]">{feature.desc}</p>
                  </div>
                </div>
                <span className="mt-5 inline-flex items-center text-sm font-medium text-brand-primary">
                  Xem ngay
                  <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-brand-outline-variant py-12">
        <h2 className="text-[22px] font-medium leading-tight tracking-normal text-brand-secondary">
          Cảm hứng theo khu vực
        </h2>
        <div className="mt-8 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-6">
          {provincesData.map((province) => (
            <Link
              key={province.name}
              href={`/destinations?province=${province.name}`}
              className="min-w-0 rounded-lg p-1 transition-[background-color] hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20"
            >
              <span className="flex items-center gap-1 text-base font-semibold text-brand-secondary">
                <MapPin className="size-4 text-brand-primary" aria-hidden="true" />
                {province.name}
              </span>
              <span className="mt-1 block truncate text-sm text-[#6a6a6a]">{province.category}</span>
              <span className="mt-1 block text-sm text-[#6a6a6a]">{province.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </UserLayout>
  );
}
