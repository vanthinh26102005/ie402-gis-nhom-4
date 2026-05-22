import { AuthPanel } from "@/components/auth/AuthPanel";
import { UserLayout } from "@/components/layout/UserLayout";

export default function RegisterPage() {
  return (
    <UserLayout>
      <AuthPanel initialMode="register" />
    </UserLayout>
  );
}
