"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCw } from "lucide-react";
import { UserLayout } from "@/components/layout/UserLayout";
import { RoutingExperience } from "@/components/routing/RoutingExperience";

export default function RoutePage() {
  return (
    <Suspense
      fallback={
        <UserLayout>
          <main className="flex min-h-screen items-center justify-center bg-brand-background py-8">
            <div className="text-center font-bold text-slate-500">
              <RotateCw className="mx-auto mb-2 size-8 animate-spin text-brand-primary" />
              Đang tải trang chỉ đường...
            </div>
          </main>
        </UserLayout>
      }
    >
      <RouteContent />
    </Suspense>
  );
}

function RouteContent() {
  const searchParams = useSearchParams();
  const initialStartId = searchParams.get("start") || searchParams.get("startId") || "";
  const initialEndId = searchParams.get("end") || searchParams.get("endId") || "";

  return (
    <UserLayout>
      <main className="min-h-screen bg-brand-background py-8">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          <header className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-primary">
              Định tuyến & chỉ đường thông minh
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Chọn điểm đi và điểm đến để vẽ tuyến OSRM trực tiếp trên bản đồ du lịch.
            </p>
          </header>

          <RoutingExperience initialEndId={initialEndId} initialStartId={initialStartId} />
        </div>
      </main>
    </UserLayout>
  );
}
