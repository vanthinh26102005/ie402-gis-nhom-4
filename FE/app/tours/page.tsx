import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/common/Button";
import { UserLayout } from "@/components/layout/UserLayout";
import { TourList } from "@/components/tours/TourList";

export default function ToursPage() {
  return (
    <UserLayout>
      <div className="mx-auto w-full max-w-[1280px] space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-primary">Không gian cá nhân</p>
            <h1 className="mt-1 text-[28px] font-bold leading-[1.43] text-brand-secondary">Kế hoạch của tôi</h1>
            <p className="mt-2 text-base text-[#3f3f3f]">Theo dõi, tiếp tục và quản lý các chuyến đi đã lưu.</p>
          </div>
          <Button asChild><Link href="/tours/create"><Plus className="size-4" />Tạo kế hoạch</Link></Button>
        </div>
        <TourList />
      </div>
    </UserLayout>
  );
}
