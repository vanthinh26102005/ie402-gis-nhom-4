import { Card } from "@/components/common/Card";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";

export default function WeatherTrafficPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Thời tiết / giao thông"
        description="Trang hiển thị dữ liệu hỗ trợ theo khu vực du lịch."
        placeholder="Trang này là trang xem thời tiết / giao thông."
        suggestions={[
          "Tích hợp API thời tiết và giao thông.",
          "Hiển thị cảnh báo theo khu vực hoặc điểm du lịch.",
          "Chuẩn bị component WeatherCard, TrafficCard và AlertBox.",
        ]}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="p-4">
            <p className="text-sm font-semibold text-slate-900">Weather_Card</p>
            <p className="mt-1 text-xs text-slate-500">Placeholder thời tiết.</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-semibold text-slate-900">Traffic_Card</p>
            <p className="mt-1 text-xs text-slate-500">Placeholder giao thông.</p>
          </Card>
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
