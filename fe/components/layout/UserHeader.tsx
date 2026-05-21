import Link from "next/link";
import { MapPinned } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { userNavigationRoutes } from "@/lib/routes";

export function UserHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-brand-outline-variant/25 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-sm shadow-brand-primary/20">
            <MapPinned className="size-5" aria-hidden="true" />
          </span>
          <span className="text-brand-primary font-bold text-lg">{APP_NAME}</span>
        </Link>

        <nav aria-label="Điều hướng người dùng" className="flex flex-wrap gap-2">
          {userNavigationRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-brand-secondary/10 hover:text-brand-secondary active:scale-95"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

