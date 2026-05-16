import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";

export default function MapPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Bản đồ du lịch 2D"
        description="Không gian chính để hiển thị bản đồ nền, marker điểm du lịch và lớp dữ liệu GIS."
        placeholder="Trang này là trang bản đồ du lịch 2D."
        suggestions={[
          "Tích hợp Leaflet, OpenLayers hoặc ArcGIS Maps SDK.",
          "Hiển thị marker điểm du lịch và dịch vụ hỗ trợ.",
          "Tách component MapView, MapMarker và MapPopup.",
        ]}
      >
        <div className="flex aspect-[16/8] min-h-72 items-center justify-center rounded-md border border-dashed border-emerald-300 bg-emerald-50 text-sm font-medium text-emerald-900">
          Placeholder bản đồ 2D
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
