import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export default function ModerateReviewPage() {
  return (
    <PagePlaceholder
      title="Kiểm duyệt đánh giá"
      description="Trang kiểm tra nội dung đánh giá trước khi hiển thị hoặc xử lý vi phạm."
      placeholder="Trang này là trang kiểm duyệt đánh giá."
      suggestions={[
        "Lấy id từ dynamic route để tải nội dung đánh giá.",
        "Thêm hành động duyệt, ẩn hoặc xóa đánh giá.",
        "Ghi lại trạng thái kiểm duyệt.",
      ]}
    >
      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold text-slate-900">Review detail placeholder</p>
        <p className="text-sm text-slate-600">
          Nội dung đánh giá sẽ được hiển thị tại đây sau khi có API.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Duyệt</Button>
          <Button className="bg-slate-700 hover:bg-slate-800">Ẩn đánh giá</Button>
        </div>
      </Card>
    </PagePlaceholder>
  );
}
