import type { ReactNode } from "react";
import { UserFooter } from "@/components/layout/UserFooter";
import { UserHeader } from "@/components/layout/UserHeader";

export function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-brand-secondary">
      <UserHeader />
      <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <UserFooter />
    </div>
  );
}
