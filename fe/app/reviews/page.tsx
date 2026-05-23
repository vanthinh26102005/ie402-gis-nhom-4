import { Card } from "@/components/common/Card";
import { SubmitReviewForm } from "@/components/reviews/SubmitReviewForm";
import { UserLayout } from "@/components/layout/UserLayout";

export default function ReviewsPage() {
  return (
    <UserLayout>
      <div className="mx-auto w-full max-w-xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Đánh giá địa điểm
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Chọn địa điểm, chấm điểm và gửi phản hồi sau khi trải nghiệm. Đánh
            giá sẽ được kiểm duyệt trước khi hiển thị công khai.
          </p>
        </div>

        <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/50">
          <SubmitReviewForm />
        </Card>
      </div>
    </UserLayout>
  );
}
