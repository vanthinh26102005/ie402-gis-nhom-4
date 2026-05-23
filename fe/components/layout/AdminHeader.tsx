"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function AdminHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex min-h-16 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
            Bảng quản trị
          </p>
          <p className="text-lg font-semibold text-slate-950">
            Quản lý dữ liệu WebGIS
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Đã bật xác thực
          </span>
          <Link
            href="/"
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Về trang user
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
