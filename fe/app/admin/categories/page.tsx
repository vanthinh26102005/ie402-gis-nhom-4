import { DataTablePlaceholder } from "@/components/common/DataTablePlaceholder";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export default function AdminCategoriesPage() {
  return (
    <PagePlaceholder
      title="Quản lý loại hình du lịch"
      description="Trang quản lý danh mục loại hình cho điểm du lịch."
      placeholder="Trang này là trang quản lý loại hình du lịch."
      suggestions={[
        "Kết nối bảng DestinationCategory.",
        "Thêm form tạo và chỉnh sửa danh mục.",
        "Đảm bảo tên loại hình không bị trùng.",
      ]}
    >
      <DataTablePlaceholder
        title="Table_Category"
        columns={["Tên loại hình", "Mô tả", "Cập nhật", "Thao tác"]}
      />
    </PagePlaceholder>
  );
}
