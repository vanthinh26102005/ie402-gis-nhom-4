import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { UserLayout } from "@/components/layout/UserLayout";

export default function LoginPage() {
  return (
    <UserLayout>
      <PagePlaceholder
        title="Đăng nhập người dùng"
        description="Màn hình đăng nhập dành cho du khách hoặc người dùng phổ thông."
        placeholder="Trang này là trang đăng nhập người dùng."
        suggestions={[
          "Kết nối API xác thực.",
          "Thêm validate email và mật khẩu.",
          "Điều hướng người dùng về trang trước đó sau khi đăng nhập.",
        ]}
      >
        <div className="grid max-w-md gap-3">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Mật khẩu" type="password" />
          <Button>Đăng nhập</Button>
        </div>
      </PagePlaceholder>
    </UserLayout>
  );
}
