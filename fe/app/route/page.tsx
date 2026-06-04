"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCw } from "lucide-react";
import { RoutingExperience } from "@/components/routing/RoutingExperience";

export default function RoutePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-brand-background py-8">
          <div className="text-center font-bold text-slate-500">
            <RotateCw className="mx-auto mb-2 size-8 animate-spin text-brand-primary" />
            Đang tải trang chỉ đường...
          </div>
        </main>
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

  return <RoutingExperience initialEndId={initialEndId} initialStartId={initialStartId} />;
}
