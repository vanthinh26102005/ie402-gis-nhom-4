"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { UserLayout } from "@/components/layout/UserLayout";
import { WeatherTrafficDashboard } from "@/components/weather-traffic/WeatherTrafficDashboard";

export default function WeatherTrafficPage() {
  return (
    <Suspense
      fallback={
        <UserLayout>
          <main className="flex min-h-screen items-center justify-center py-8">
            <div className="text-center text-sm font-semibold text-slate-500">
              <RefreshCw className="mx-auto mb-2 size-8 animate-spin text-blue-700" />
              Đang tải thông tin thời tiết và giao thông...
            </div>
          </main>
        </UserLayout>
      }
    >
      <WeatherTrafficContent />
    </Suspense>
  );
}

function WeatherTrafficContent() {
  const searchParams = useSearchParams();
  const initialProvince = searchParams.get("province") || "";

  return (
    <UserLayout>
      <main className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <WeatherTrafficDashboard initialProvince={initialProvince} />
        </div>
      </main>
    </UserLayout>
  );
}
