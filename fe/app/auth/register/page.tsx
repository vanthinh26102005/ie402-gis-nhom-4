import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";

export default function RegisterPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Đăng ký người dùng"
        description="Màn hình tạo tài khoản để lưu tour và gửi đánh giá."
        placeholder="Trang này là trang đăng ký người dùng."
        suggestions={[
          "Tạo form đăng ký đầy đủ thông tin.",
          "Kết nối endpoint tạo tài khoản.",
          "Thêm xử lý lỗi trùng email và mật khẩu yếu.",
        ]}
      >
        <div className="grid max-w-md gap-3">
          <Input placeholder="Họ và tên" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Mật khẩu" type="password" />
          <Button>Tạo tài khoản</Button>
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
