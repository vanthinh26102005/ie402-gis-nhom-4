import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";

export default function MapLayersPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Lớp dữ liệu bản đồ"
        description="Trang quản lý bật tắt các lớp điểm du lịch, dịch vụ, giao thông và ranh giới."
        placeholder="Trang này là trang xem lớp dữ liệu."
        suggestions={[
          "Tạo LayerPanel với switch bật tắt từng lớp.",
          "Đồng bộ trạng thái lớp dữ liệu với MapView.",
          "Chuẩn bị cấu hình layer trong một file riêng.",
        ]}
      />
    </UserLayout>
  );
}
