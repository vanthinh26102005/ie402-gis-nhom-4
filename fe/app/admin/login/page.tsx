import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { APP_NAME } from "@/lib/constants";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-primary text-white">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-primary">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">
              Đăng nhập quản trị
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Chỉ tài khoản có role admin mới được vào dashboard {APP_NAME}.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <LoginForm defaultRedirect="/admin" />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4 text-sm">
          <Link href="/" className="font-semibold text-brand-primary hover:underline">
            Quay về trang người dùng
          </Link>
        </div>
      </section>
    </main>
  );
}
