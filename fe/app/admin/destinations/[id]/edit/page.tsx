import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Select } from "@/components/common/Select";
import { REGION_PROVINCES } from "@/lib/constants";

export default function EditDestinationPage() {
  return (
    <PagePlaceholder
      title="Sửa điểm du lịch"
      description="Trang biểu mẫu cập nhật thông tin một điểm du lịch đã tồn tại."
      placeholder="Trang này là trang sửa điểm du lịch."
      suggestions={[
        "Lấy id từ dynamic route để tải dữ liệu hiện có.",
        "Tái sử dụng form với trang thêm điểm du lịch.",
        "Gửi API cập nhật và xử lý trạng thái lưu.",
      ]}
    >
      <div className="grid max-w-2xl gap-3 md:grid-cols-2">
        <Input placeholder="Tên điểm du lịch" />
        <Select
          defaultValue=""
          options={[
            { label: "Chọn tỉnh/thành", value: "" },
            ...REGION_PROVINCES.map((province) => ({
              label: province,
              value: province,
            })),
          ]}
        />
        <Input placeholder="Địa chỉ" />
        <Input placeholder="Tọa độ" />
        <Button className="md:col-span-2">Cập nhật điểm du lịch</Button>
      </div>
    </PagePlaceholder>
  );
}
