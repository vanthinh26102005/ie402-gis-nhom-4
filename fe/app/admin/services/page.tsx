import { DataTablePlaceholder } from "@/components/common/DataTablePlaceholder";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export default function AdminServicesPage() {
  return (
    <PagePlaceholder
      title="Quản lý dịch vụ hỗ trợ"
      description="Trang quản lý khách sạn, nhà hàng, bãi đỗ xe, y tế và tiện ích liên quan."
      placeholder="Trang này là trang quản lý dịch vụ hỗ trợ."
      suggestions={[
        "Kết nối bảng ServiceFacility.",
        "Thêm bộ lọc loại dịch vụ và tỉnh/thành.",
        "Chuẩn bị form thêm/sửa dịch vụ hỗ trợ.",
      ]}
    >
      <DataTablePlaceholder title="Table_Service" />
    </PagePlaceholder>
  );
}
