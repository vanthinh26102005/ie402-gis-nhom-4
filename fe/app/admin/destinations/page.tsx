import { DataTablePlaceholder } from "@/components/common/DataTablePlaceholder";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export default function AdminDestinationsPage() {
  return (
    <PagePlaceholder
      title="Quản lý điểm du lịch"
      description="Trang danh sách và thao tác dữ liệu điểm du lịch."
      placeholder="Trang này là trang quản lý điểm du lịch."
      suggestions={[
        "Kết nối bảng TouristDestination.",
        "Thêm tìm kiếm, lọc tỉnh/thành và loại hình.",
        "Điều hướng sang trang thêm/sửa điểm du lịch.",
      ]}
    >
      <DataTablePlaceholder title="Table_Destination" />
    </PagePlaceholder>
  );
}
