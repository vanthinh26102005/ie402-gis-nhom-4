import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Select } from "@/components/common/Select";
import { UserLayout } from "@/components/layout/UserLayout";
import { REGION_PROVINCES } from "@/lib/constants";

export default function DestinationsPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Tìm kiếm và lọc địa điểm"
        description="Trang tra cứu điểm du lịch theo tên, tỉnh/thành và loại hình."
        placeholder="Trang này là trang tìm kiếm và lọc địa điểm."
        suggestions={[
          "Tạo danh sách kết quả đồng bộ với marker trên bản đồ.",
          "Thêm bộ lọc tỉnh/thành, loại hình, điểm đánh giá.",
          "Kết nối API TouristDestination.",
        ]}
      >
        <div className="grid gap-3 md:grid-cols-[1fr_220px_160px]">
          <Input placeholder="Nhập tên điểm du lịch" />
          <Select
            defaultValue=""
            options={[
              { label: "Tất cả tỉnh/thành", value: "" },
              ...REGION_PROVINCES.map((province) => ({
                label: province,
                value: province,
              })),
            ]}
          />
          <Button>Tìm kiếm</Button>
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
