import { DataTablePlaceholder } from "@/components/common/DataTablePlaceholder";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export default function AdminNotificationsPage() {
  return (
    <PagePlaceholder
      title="Quản lý thông báo"
      description="Trang tạo, cập nhật và xóa thông báo liên quan đến điểm du lịch."
      placeholder="Trang này là trang quản lý thông báo."
      suggestions={[
        "Kết nối bảng Notification.",
        "Thêm chọn điểm du lịch liên quan.",
        "Quản lý trạng thái đang hiển thị hoặc hết hiệu lực.",
      ]}
    >
      <DataTablePlaceholder
        title="Table_Notification"
        columns={["Tiêu đề", "Loại", "Trạng thái", "Thao tác"]}
      />
    </PagePlaceholder>
  );
}
