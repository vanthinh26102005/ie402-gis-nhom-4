import { AuthPanel } from "@/components/auth/AuthPanel";
import { UserLayout } from "@/components/layout/UserLayout";

export default function LoginPage() {
  return (
    <UserLayout>
      <AuthPanel initialMode="login" />
    </UserLayout>
  );
}
