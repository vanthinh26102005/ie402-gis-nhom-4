import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";

export default function CreateTourPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Tạo tour du lịch"
        description="Trang cho phép người dùng chọn nhiều điểm đến và xây dựng hành trình."
        placeholder="Trang này là trang tạo tour du lịch."
        suggestions={[
          "Tạo danh sách điểm đến đã chọn.",
          "Cho phép sắp xếp thứ tự tham quan.",
          "Kết nối API TourPlan và TourPlanDetail khi backend có sẵn.",
        ]}
      >
        <div className="grid max-w-xl gap-3">
          <Input placeholder="Tên tour" />
          <Input placeholder="Mô tả ngắn" />
          <Button>Lưu tour nháp</Button>
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
