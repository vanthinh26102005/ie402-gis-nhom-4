import { Card } from "@/components/common/Card";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

const metrics = ["Điểm du lịch", "Dịch vụ hỗ trợ", "Đánh giá"];

export default function AdminDashboardPage() {
  return (
    <PagePlaceholder
      title="Tổng quan quản trị"
      description="Dashboard tổng quan cho quản trị viên theo dõi dữ liệu hệ thống."
      placeholder="Trang này là trang tổng quan quản trị."
      suggestions={[
        "Hiển thị số lượng điểm du lịch, dịch vụ, đánh giá.",
        "Thêm biểu đồ thống kê theo tỉnh/thành.",
        "Gắn API thống kê khi backend hoàn thiện.",
      ]}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric} className="p-4">
            <p className="text-sm font-semibold text-slate-900">{metric}</p>
            <p className="mt-2 text-2xl font-semibold text-blue-700">--</p>
          </Card>
        ))}
      </div>
    </PagePlaceholder>
  );
}
