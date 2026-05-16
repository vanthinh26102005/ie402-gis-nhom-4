import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";

export default function DestinationDetailPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Chi tiết địa điểm"
        description="Trang hiển thị thông tin thuộc tính, hình ảnh, thời gian mở cửa và đánh giá."
        placeholder="Trang này là trang xem chi tiết địa điểm."
        suggestions={[
          "Lấy id từ dynamic route để gọi API chi tiết địa điểm.",
          "Tạo component DestinationGallery và DestinationInfo.",
          "Hiển thị đánh giá, thông báo, thời tiết và giao thông liên quan.",
        ]}
      />
    </UserLayout>
  );
}
