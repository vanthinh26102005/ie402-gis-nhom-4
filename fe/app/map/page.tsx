import { UserLayout } from "@/components/layout/UserLayout";
import { MapView } from "@/components/map/MapView";

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
              Bản đồ nền OpenStreetMap hiển thị điểm du lịch và dịch vụ hỗ trợ
              từ PostgreSQL/PostGIS cho phạm vi Quảng Trị - Huế - Đà Nẵng.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">DB</p>
              <p className="mt-1 text-xs font-medium text-slate-500">PostGIS</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">2</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Lớp</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">OSM</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Nền</p>
            </div>
          </div>
        </section>

        <MapView />
      </div>
    </UserLayout>
  );
}
