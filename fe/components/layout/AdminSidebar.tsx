import Link from "next/link";
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
  return (
    <aside className="w-full border-b border-slate-200 bg-slate-950 text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs uppercase tracking-wide text-emerald-300">Admin</p>
        <h2 className="mt-1 text-lg font-semibold">{APP_NAME}</h2>
      </div>

      <nav aria-label="Điều hướng quản trị" className="grid gap-1 p-3">
        {adminNavigationRoutes.map((route) => {
          const Icon = iconByName[route.icon] ?? LayoutDashboard;

          return (
            <Link
              key={route.href}
              href={route.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-4 text-emerald-300" aria-hidden="true" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
