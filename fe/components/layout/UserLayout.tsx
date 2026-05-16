import type { ReactNode } from "react";
import { UserFooter } from "@/components/layout/UserFooter";
import { UserHeader } from "@/components/layout/UserHeader";

export function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <UserHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <UserFooter />
    </div>
  );
}
