import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Select } from "@/components/common/Select";
import { REGION_PROVINCES } from "@/lib/constants";

export default function NewDestinationPage() {
  return (
    <PagePlaceholder
      title="Thêm điểm du lịch"
      description="Trang biểu mẫu tạo mới một điểm du lịch trong hệ thống."
      placeholder="Trang này là trang thêm điểm du lịch."
      suggestions={[
        "Tạo form đầy đủ theo schema TouristDestination.",
        "Thêm chọn tọa độ trên bản đồ.",
        "Kết nối API tạo mới dữ liệu.",
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
        <Input placeholder="Giá vé" />
        <Button className="md:col-span-2">Lưu điểm du lịch</Button>
      </div>
    </PagePlaceholder>
  );
}
