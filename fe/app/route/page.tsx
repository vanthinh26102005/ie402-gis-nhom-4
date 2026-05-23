import { UserLayout } from "@/components/layout/UserLayout";
import { RoutingExperience } from "@/components/routing/RoutingExperience";

export default function RoutePage() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <section className="max-w-3xl space-y-2">
          <p className="text-sm font-semibold uppercase text-emerald-700">OSRM routing</p>
          <h1 className="text-3xl font-semibold text-slate-950">
            Chỉ đường và lộ trình du lịch
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Chọn hai địa điểm du lịch, backend sẽ gọi OSRM và trả về tuyến đường
            để vẽ trực tiếp trên bản đồ Leaflet.
          </p>
        </section>

        <RoutingExperience />
      </div>
    </UserLayout>
  );
}
