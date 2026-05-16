import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export default function AdminLoginPage() {
  return (
    <PagePlaceholder
      title="Đăng nhập quản trị viên"
      description="Màn hình đăng nhập dành cho quản trị viên hệ thống."
      placeholder="Trang này là trang đăng nhập quản trị viên."
      suggestions={[
        "Kết nối API đăng nhập admin.",
        "Phân quyền route quản trị.",
        "Thêm xử lý session hoặc token.",
      ]}
    >
      <div className="grid max-w-md gap-3">
        <Input placeholder="Email quản trị" type="email" />
        <Input placeholder="Mật khẩu" type="password" />
        <Button>Đăng nhập quản trị</Button>
      </div>
    </PagePlaceholder>
  );
}
