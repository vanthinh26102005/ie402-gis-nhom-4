import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Select } from "@/components/common/Select";

export default function AdminWeatherPage() {
  return (
    <PagePlaceholder
      title="Cập nhật dữ liệu thời tiết"
      description="Trang nhập hoặc đồng bộ dữ liệu thời tiết theo điểm/khu vực du lịch."
      placeholder="Trang này là trang cập nhật dữ liệu thời tiết."
      suggestions={[
        "Kết nối bảng WeatherInfo.",
        "Đồng bộ dữ liệu từ API thời tiết.",
        "Thêm lịch sử quan sát theo thời gian.",
      ]}
    >
      <div className="grid max-w-2xl gap-3 md:grid-cols-3">
        <Select
          defaultValue=""
          options={[
            { label: "Chọn điểm du lịch", value: "" },
            { label: "Đại Nội Huế", value: "hue-citadel" },
          ]}
        />
        <Input placeholder="Nhiệt độ" />
        <Input placeholder="Độ ẩm" />
        <Button className="md:col-span-3">Cập nhật thời tiết</Button>
      </div>
    </PagePlaceholder>
  );
}
