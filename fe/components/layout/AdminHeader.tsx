"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/lib/auth/authContext";

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="border-b border-brand-outline-variant bg-white">
      <div className="flex min-h-16 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6a6a6a]">
            Bảng quản trị
          </p>
          <p className="text-lg font-semibold text-brand-secondary">
            Quản lý dữ liệu WebGIS
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-outline-variant bg-white px-3 py-1 text-xs font-medium text-brand-secondary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {user?.email || "Admin"}
          </span>
          <Link
            href="/"
            className="rounded-lg border border-brand-outline-variant px-3 py-2 text-sm font-medium text-brand-secondary transition-[background-color] hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20"
          >
            Về trang user
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
