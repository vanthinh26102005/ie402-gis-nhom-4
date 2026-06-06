"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Car,
  CloudSun,
  FolderTree,
  LayoutDashboard,
  MapPinned,
  MessageSquareText,
  Shapes,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { adminNavigationRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const iconByName: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  destination: MapPinned,
  service: Store,
  category: FolderTree,
  notification: Bell,
  weather: CloudSun,
  traffic: Car,
  review: MessageSquareText,
  map: Shapes,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-brand-outline-variant bg-white text-brand-secondary lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="border-b border-brand-outline-variant px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[#6a6a6a]">Admin</p>
        <h2 className="mt-1 text-lg font-semibold text-brand-primary">{APP_NAME}</h2>
      </div>

      <nav aria-label="Điều hướng quản trị" className="grid gap-1 p-3">
        {adminNavigationRoutes.map((route) => {
          const Icon = iconByName[route.icon] ?? LayoutDashboard;
          const isActive =
            pathname === route.href || (route.href !== "/admin" && pathname.startsWith(`${route.href}/`));

          return (
            <Link
              key={route.href}
              href={route.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-[background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20",
                isActive
                  ? "bg-brand-primary text-white shadow-[var(--shadow-brand-map)]"
                  : "text-[#3f3f3f] hover:bg-brand-surface-low hover:text-brand-secondary",
              )}
            >
              <Icon className={cn("size-4", isActive ? "text-white" : "text-brand-primary")} aria-hidden="true" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
