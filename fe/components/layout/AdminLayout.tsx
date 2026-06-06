"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Button } from "@/components/common/Button";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuth } from "@/lib/auth/authContext";

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isLoginPage = pathname === "/admin/login";
  const isAdmin = user?.role === "admin";

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-white px-4">
        <div className="rounded-lg border border-brand-outline-variant bg-white px-5 py-4 text-sm font-medium text-[#6a6a6a] shadow-[var(--shadow-brand-map)]">
          Đang kiểm tra quyền quản trị…
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-white px-4">
        <section className="w-full max-w-md rounded-brand-card border border-brand-outline-variant bg-white p-6 text-center shadow-[var(--shadow-brand-map)]">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand-surface-low text-brand-danger">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-brand-secondary">Không có quyền quản trị</h1>
          <p className="mt-2 text-sm leading-6 text-[#6a6a6a]">
            Khu vực admin chỉ hiển thị cho tài khoản có role <strong>admin</strong>.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/admin/login">Đăng nhập admin</Link>
            </Button>
            {isAuthenticated ? <LogoutButton /> : null}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminHeader />
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
