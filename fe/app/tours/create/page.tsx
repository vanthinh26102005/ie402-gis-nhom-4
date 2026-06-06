import { Suspense } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { TourPlannerForm } from "@/components/tours/TourPlannerForm";

export default function CreateTourPage() {
  return (
    <UserLayout>
      <div className="mx-auto w-full max-w-[1280px] space-y-7">
        <div className="max-w-3xl space-y-2">
          <p className="text-sm font-medium text-brand-primary">Kế hoạch cá nhân</p>
          <h1 className="text-[28px] font-bold leading-[1.43] tracking-normal text-brand-secondary">
            Lập kế hoạch chuyến đi
          </h1>
          <p className="text-base leading-7 text-[#3f3f3f]">
            Biến tuyến đường thành lịch trình có thời gian, chi phí và các điểm dừng rõ ràng.
          </p>
        </div>

        <Suspense fallback={<p className="text-sm text-[#6a6a6a]">Đang chuẩn bị planner…</p>}>
          <TourPlannerForm />
        </Suspense>
      </div>
    </UserLayout>
  );
}
