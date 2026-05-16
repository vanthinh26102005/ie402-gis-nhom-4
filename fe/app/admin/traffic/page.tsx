import { Button } from "@/components/common/Button";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Select } from "@/components/common/Select";

export default function AdminTrafficPage() {
  return (
    <PagePlaceholder
      title="Cập nhật dữ liệu giao thông"
      description="Trang nhập hoặc đồng bộ tình trạng giao thông theo điểm/khu vực."
      placeholder="Trang này là trang cập nhật dữ liệu giao thông."
      suggestions={[
        "Kết nối bảng TrafficInfo.",
        "Đồng bộ dữ liệu từ API giao thông nếu có.",
        "Hiển thị mức ùn tắc và trạng thái tuyến đường.",
      ]}
    >
      <div className="grid max-w-2xl gap-3 md:grid-cols-3">
        <Select
          defaultValue=""
          options={[
            { label: "Chọn khu vực", value: "" },
            { label: "Quốc lộ 1A", value: "ql1a" },
          ]}
        />
        <Select
          defaultValue=""
          options={[
            { label: "Mức ùn tắc", value: "" },
            { label: "Thấp", value: "low" },
            { label: "Trung bình", value: "medium" },
            { label: "Cao", value: "high" },
          ]}
        />
        <Button>Cập nhật</Button>
      </div>
    </PagePlaceholder>
  );
}
