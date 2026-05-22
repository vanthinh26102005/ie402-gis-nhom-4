import { Card } from "@/components/common/Card";
import { CreateTourForm } from "@/components/tours/CreateTourForm";
import { UserLayout } from "@/components/layout/UserLayout";

export default function CreateTourPage() {
  return (
    <UserLayout>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Tạo tour du lịch
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Chọn nhiều điểm đến, sắp xếp thứ tự tham quan và lưu hành trình cá
            nhân.
          </p>
        </div>

        <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/50">
          <CreateTourForm />
        </Card>
      </div>
    </UserLayout>
  );
}
