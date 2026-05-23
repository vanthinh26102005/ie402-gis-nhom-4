"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/lib/auth/authContext";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/auth/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      <LogOut className="size-4" aria-hidden="true" />
      {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
    </Button>
  );
}
