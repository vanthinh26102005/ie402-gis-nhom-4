import { Card } from "@/components/common/Card";
import { SubmitReviewForm } from "@/components/reviews/SubmitReviewForm";
import { UserLayout } from "@/components/layout/UserLayout";

export default function ReviewsPage() {
  return (
    <UserLayout>
      <div className="mx-auto w-full max-w-xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#6a6a6a]">Cộng đồng</p>
          <h1 className="text-[28px] font-bold leading-[1.43] tracking-normal text-brand-secondary">
            Đánh giá địa điểm
          </h1>
          <p className="text-base leading-7 text-[#3f3f3f]">
            Chọn địa điểm, chấm điểm và gửi phản hồi sau khi trải nghiệm. Đánh
            giá sẽ được kiểm duyệt trước khi hiển thị công khai.
          </p>
        </div>

        <Card>
          <SubmitReviewForm />
        </Card>
      </div>
    </UserLayout>
  );
}
