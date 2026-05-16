import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";

export default function RoutePage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Chỉ đường"
        description="Trang chọn điểm bắt đầu, điểm đến và hiển thị tuyến đường trên bản đồ."
        placeholder="Trang này là trang chỉ đường."
        suggestions={[
          "Xây dựng form chọn điểm xuất phát và điểm đến.",
          "Tích hợp thuật toán định tuyến hoặc dịch vụ routing.",
          "Hiển thị polyline tuyến đường trên bản đồ 2D.",
        ]}
      >
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_160px]">
          <Input placeholder="Điểm bắt đầu" />
          <Input placeholder="Điểm đến" />
          <Button>Tìm đường</Button>
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
