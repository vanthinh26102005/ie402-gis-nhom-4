import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { UserLayout } from "@/components/layout/UserLayout";
import { TourDetailView } from "@/components/tours/TourDetailView";

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <UserLayout>
      <div className="mx-auto w-full max-w-[1180px] space-y-6">
        <Link href="/tours" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-secondary hover:underline">
          <ChevronLeft className="size-4" />Kế hoạch của tôi
        </Link>
        <div>
          <p className="text-sm font-medium text-brand-primary">Chi tiết hành trình</p>
          <h1 className="mt-1 text-[28px] font-bold leading-[1.43] text-brand-secondary">Kế hoạch chuyến đi</h1>
        </div>
        <TourDetailView tourId={id} />
      </div>
    </UserLayout>
  );
}
