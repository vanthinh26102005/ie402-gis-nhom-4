import { DataTablePlaceholder } from "@/components/common/DataTablePlaceholder";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export default function AdminReviewsPage() {
  return (
    <PagePlaceholder
      title="Quản lý đánh giá"
      description="Trang theo dõi, lọc và xử lý đánh giá của người dùng."
      placeholder="Trang này là trang quản lý đánh giá."
      suggestions={[
        "Kết nối bảng Review.",
        "Thêm lọc theo địa điểm và điểm số.",
        "Điều hướng sang trang kiểm duyệt từng đánh giá.",
      ]}
    >
      <DataTablePlaceholder
        title="Table_Review"
        columns={["Người đánh giá", "Địa điểm", "Điểm", "Thao tác"]}
      />
    </PagePlaceholder>
  );
}
