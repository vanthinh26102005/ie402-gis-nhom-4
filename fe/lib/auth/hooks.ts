import { useAuth } from "@/lib/auth/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isLoading, isAuthenticated };
}

/**
 * Hook to redirect to home if user is already authenticated
 * Useful for login/register pages
 */
export function useRequireGuest() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isLoading, isAuthenticated };
}
