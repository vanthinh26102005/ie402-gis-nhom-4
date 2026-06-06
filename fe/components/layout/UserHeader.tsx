"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Globe2, LogOut, MapPinned, Menu, Search } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/lib/auth/authContext";
import { APP_NAME } from "@/lib/constants";
import { userNavigationRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function UserHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const primaryRouteHrefs = new Set(["/", "/map", "/destinations", "/route"]);
  const loginRoute = userNavigationRoutes.find((route) => route.href === "/auth/login");
  const primaryRoutes = userNavigationRoutes.filter((route) => primaryRouteHrefs.has(route.href));
  const secondaryRoutes = userNavigationRoutes.filter(
    (route) => !primaryRouteHrefs.has(route.href) && route.href !== "/auth/login",
  );
  const isSecondaryActive = secondaryRoutes.some(
    (route) => pathname === route.href || pathname.startsWith(`${route.href}/`),
  );

  function isRouteActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  return (
    <header className="sticky top-0 z-30 border-b border-brand-outline-variant bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-[1280px] flex-col gap-3 px-4 py-3 sm:px-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-brand-primary"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-primary text-white">
            <MapPinned className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight" translate="no">
            {APP_NAME}
          </span>
        </Link>

        <nav
          aria-label="Điều hướng người dùng"
          className="flex min-w-0 items-center justify-start gap-1 overflow-visible lg:justify-center"
        >
          {primaryRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              aria-current={isRouteActive(route.href) ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-sm font-medium text-[#6a6a6a] transition-[background-color,color] hover:bg-brand-surface-low hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20 xl:px-4",
                isRouteActive(route.href) && "bg-white text-brand-secondary underline decoration-2 underline-offset-8",
              )}
            >
              {route.label}
            </Link>
          ))}
          <div className="relative shrink-0">
            <button
              type="button"
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
              onClick={() => setIsMoreOpen((current) => !current)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#6a6a6a] transition-[background-color,color] hover:bg-brand-surface-low hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20",
                isSecondaryActive && "bg-brand-surface-low text-brand-secondary",
              )}
            >
              Thêm
              <span className="grid min-w-5 place-items-center rounded-full bg-brand-primary px-1.5 text-[11px] font-bold leading-5 text-white">
                {secondaryRoutes.length}
              </span>
              <ChevronDown
                className={cn("size-4 transition-transform", isMoreOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {isMoreOpen ? (
              <div
                role="menu"
                className="absolute left-0 top-full z-40 mt-2 w-64 rounded-lg border border-brand-outline-variant bg-white p-2 shadow-[var(--shadow-brand-map)]"
              >
                {secondaryRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    role="menuitem"
                    onClick={() => setIsMoreOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium text-[#3f3f3f] hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20",
                      isRouteActive(route.href) && "bg-brand-surface-low text-brand-secondary",
                    )}
                  >
                    <span className="block">{route.label}</span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-[#6a6a6a]">
                      {route.description}
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex min-w-0 items-center gap-2 overflow-hidden lg:justify-end">
          <Link
            href="/destinations"
            className="hidden min-h-11 shrink-0 items-center gap-3 rounded-full border border-brand-outline-variant bg-white py-2 pl-5 pr-2 text-sm font-medium text-brand-secondary shadow-[var(--shadow-brand-map)] transition-[box-shadow] hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20 xl:inline-flex"
          >
            Tìm nơi muốn đi
            <span className="grid size-8 place-items-center rounded-full bg-brand-primary text-white">
              <Search className="size-4" aria-hidden="true" />
            </span>
          </Link>
          <button
            type="button"
            aria-label="Ngôn ngữ"
            className="grid size-11 shrink-0 place-items-center rounded-full text-brand-secondary transition-[background-color] hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20"
          >
            <Globe2 className="size-5" aria-hidden="true" />
          </button>
          {!isLoading && !isAuthenticated && loginRoute ? (
            <Link
              href={loginRoute.href}
              className="hidden min-h-10 shrink-0 items-center rounded-full px-3 text-sm font-semibold text-brand-secondary transition-colors hover:bg-brand-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20 sm:inline-flex"
            >
              {loginRoute.label}
            </Link>
          ) : null}
          {!isLoading && isAuthenticated && user ? (
            <div className="flex min-w-0 max-w-[min(100%,18rem)] items-center gap-2 rounded-full border border-brand-outline-variant bg-white py-1 pl-3 pr-1">
              <Menu className="size-4 shrink-0 text-[#6a6a6a]" aria-hidden="true" />
              <span className="min-w-0 truncate text-sm font-medium text-brand-secondary">
                {user.fullName || user.name || user.email}
              </span>
              <LogoutButton
                className="grid size-9 min-h-9 shrink-0 place-items-center rounded-full p-0"
                labelClassName="sr-only"
                icon={<LogOut className="size-4" aria-hidden="true" />}
              />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
