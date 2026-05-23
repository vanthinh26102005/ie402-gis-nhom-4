"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/authContext";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
