import { DestinationList } from "@/components/destinations/DestinationList";
import { UserLayout } from "@/components/layout/UserLayout";

export default function DestinationsPage() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <section className="max-w-3xl space-y-2">
          <p className="text-sm font-semibold uppercase text-emerald-700">Tra cứu địa điểm</p>
          <h1 className="text-3xl font-semibold text-slate-950">
            Tìm kiếm và lọc địa điểm du lịch
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Danh sách lấy trực tiếp từ PostgreSQL/PostGIS, đồng bộ với marker trên bản đồ.
          </p>
        </section>

        <DestinationList />
      </div>
    </UserLayout>
  );
}
