import Link from "next/link";
import { MapPinned } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { userNavigationRoutes } from "@/lib/routes";

export function UserHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="flex size-10 items-center justify-center rounded-md bg-blue-700 text-white">
            <MapPinned className="size-5" aria-hidden="true" />
          </span>
          <span>{APP_NAME}</span>
        </Link>

        <nav aria-label="Điều hướng người dùng" className="flex flex-wrap gap-2">
          {userNavigationRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
