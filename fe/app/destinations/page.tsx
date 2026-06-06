import Link from "next/link";
import { CloudSun, Navigation } from "lucide-react";
import { Button } from "@/components/common/Button";
import { DestinationList } from "@/components/destinations/DestinationList";
import { UserLayout } from "@/components/layout/UserLayout";

export default function DestinationsPage() {
  return (
    <UserLayout>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1280px]">
          <header className="mb-8 flex flex-col gap-5 border-b border-brand-outline-variant pb-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#6a6a6a]">Bản đồ & du lịch</p>
              <h1 className="text-[28px] font-bold leading-[1.43] tracking-normal text-brand-secondary">
              Khám phá điểm đến du lịch
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#3f3f3f]">
                Tìm kiếm di tích, danh lam, bãi biển, bảo tàng và khu vui chơi từ dữ liệu PostgreSQL/PostGIS.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="cursor-pointer"
              >
                <Link href="/route">
                  <Navigation className="mr-1.5 size-3.5" aria-hidden="true" />
                  Lập lộ trình đi
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="cursor-pointer"
              >
                <Link href="/weather-traffic">
                  <CloudSun className="mr-1.5 size-3.5" aria-hidden="true" />
                  Thời tiết & giao thông
                </Link>
              </Button>
            </div>
          </header>

          <DestinationList />
        </div>
      </main>
    </UserLayout>
  );
}
