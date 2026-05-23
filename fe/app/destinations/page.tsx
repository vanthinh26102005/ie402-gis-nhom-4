import Link from "next/link";
import { CloudSun, Navigation } from "lucide-react";
import { Button } from "@/components/common/Button";
import { DestinationList } from "@/components/destinations/DestinationList";
import { UserLayout } from "@/components/layout/UserLayout";

export default function DestinationsPage() {
  return (
    <UserLayout>
      <main className="min-h-screen bg-brand-background py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <header className="mb-8 text-center md:text-left">
            <div className="mb-2 inline-block rounded-full bg-brand-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary">
              Bản đồ & du lịch
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-primary md:text-4xl">
              Khám phá điểm đến du lịch
            </h1>
            <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-brand-secondary md:mx-0" />
            <p className="mt-3 max-w-2xl text-xs font-medium leading-relaxed text-slate-600 md:text-sm">
              Tìm kiếm và lựa chọn các di tích lịch sử, danh lam thắng cảnh, bãi biển,
              bảo tàng và khu vui chơi từ dữ liệu PostgreSQL/PostGIS.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="cursor-pointer rounded-xl border-brand-primary/20 bg-brand-primary/5 text-xs font-bold text-brand-primary hover:bg-brand-primary/10"
              >
                <Link href="/route">
                  <Navigation className="mr-1.5 size-3.5 text-brand-primary" />
                  Lập lộ trình đi
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="cursor-pointer rounded-xl border-brand-secondary/20 bg-brand-secondary/5 text-xs font-bold text-brand-secondary hover:bg-brand-secondary/10"
              >
                <Link href="/weather-traffic">
                  <CloudSun className="mr-1.5 size-3.5 text-brand-secondary" />
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
