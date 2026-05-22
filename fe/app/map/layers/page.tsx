import { UserLayout } from "@/components/layout/UserLayout";
import { LayerStatusList } from "@/components/map/LayerStatusList";
import Link from "next/link";

export default function MapLayersPage() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-sm font-semibold uppercase text-emerald-700">GIS layers</p>
            <h1 className="text-3xl font-semibold text-slate-950">Lớp dữ liệu bản đồ</h1>
            <p className="text-sm leading-6 text-slate-600">
              Trạng thái các lớp dữ liệu đang dùng cho bản đồ user-facing. Các lớp điểm và tuyến
              hiện dùng dữ liệu mẫu phía frontend, sẵn sàng thay bằng GeoJSON/API khi backend có
              endpoint chính thức.
            </p>
          </div>
          <Link
            href="/map"
            className="inline-flex w-fit rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Mở bản đồ
          </Link>
        </section>

        <LayerStatusList />
      </div>
    </UserLayout>
  );
}
