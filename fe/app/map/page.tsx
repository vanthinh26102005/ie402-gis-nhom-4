import { UserLayout } from "@/components/layout/UserLayout";
import { MapView } from "@/components/map/MapView";
import { MAP_LAYERS, MAP_POINTS, TOURISM_ROUTE } from "@/lib/map-data";

export default function MapPage() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-sm font-semibold uppercase text-emerald-700">WebGIS du lịch 2D</p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Bản đồ du lịch miền Trung
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Bản đồ nền OpenStreetMap hiển thị điểm du lịch, dịch vụ hỗ trợ và tuyến kết nối
              mẫu cho phạm vi Quảng Trị - Huế - Đà Nẵng.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">{MAP_POINTS.length}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Marker</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">{MAP_LAYERS.length}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Lớp</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">{TOURISM_ROUTE.length}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Nút tuyến</p>
            </div>
          </div>
        </section>

        <MapView />
      </div>
    </UserLayout>
  );
}
