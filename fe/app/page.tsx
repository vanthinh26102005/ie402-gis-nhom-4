import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";
import { REGION_PROVINCES } from "@/lib/constants";

export default function HomePage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Trang chủ"
        description="Trang tổng quan cho ứng dụng GIS Du lịch miền Trung."
        placeholder="Trang này là trang chủ của ứng dụng GIS du lịch 2D."
        suggestions={[
          "Thiết kế dashboard giới thiệu nhanh các điểm du lịch nổi bật.",
          "Thêm liên kết nhanh đến bản đồ, tìm kiếm địa điểm và tạo tour.",
          "Kết nối dữ liệu thống kê khi backend sẵn sàng.",
        ]}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {REGION_PROVINCES.map((province) => (
            <Card key={province} className="p-4">
              <p className="text-sm font-semibold text-slate-900">{province}</p>
              <p className="mt-1 text-xs text-slate-500">
                Placeholder nhóm dữ liệu điểm đến.
              </p>
            </Card>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/map">Mở bản đồ</Link>
          </Button>
          <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
            <Link href="/destinations">Tìm điểm du lịch</Link>
          </Button>
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
