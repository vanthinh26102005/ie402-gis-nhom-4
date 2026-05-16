import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Select } from "@/components/common/Select";
import { UserLayout } from "@/components/layout/UserLayout";

export default function ReviewsPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Đánh giá địa điểm"
        description="Trang gửi đánh giá và phản hồi cho các điểm du lịch đã trải nghiệm."
        placeholder="Trang này là trang đánh giá địa điểm."
        suggestions={[
          "Tạo form chọn địa điểm, điểm số và nội dung đánh giá.",
          "Yêu cầu đăng nhập trước khi gửi đánh giá.",
          "Hiển thị trạng thái chờ kiểm duyệt nếu cần.",
        ]}
      >
        <div className="grid max-w-xl gap-3">
          <Select
            defaultValue=""
            options={[
              { label: "Chọn điểm du lịch", value: "" },
              { label: "Đại Nội Huế", value: "hue-citadel" },
              { label: "Thành cổ Quảng Trị", value: "quang-tri-citadel" },
            ]}
          />
          <Input placeholder="Điểm đánh giá 1-5" />
          <Input placeholder="Nội dung đánh giá" />
          <Button>Gửi đánh giá</Button>
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
