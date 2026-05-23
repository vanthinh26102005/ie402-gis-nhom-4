"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { AuthUser, AuthResponse } from "@/lib/api";
import {
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  getUserInfo,
  setUserInfo,
} from "@/lib/auth/tokenStorage";

export type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
};

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        const storedUser = getUserInfo();

        if (token && storedUser) {
          setUser(storedUser);
        } else if (token) {
          // Token exists but no user info - optionally verify with backend
          // For now, we'll just clear it
          clearAuthToken();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string, rememberMe = false) => {
      const { loginUser } = await import("@/lib/api");
      const result = await loginUser({ email, password, rememberMe });

      if (!result.ok) {
        throw new Error(result.message);
      }

      const response = result.data as AuthResponse;
      setAuthToken(response.accessToken, rememberMe);
      setUserInfo(response.user);
      setUser(response.user);
    },
    [],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { registerUser } = await import("@/lib/api");
      const result = await registerUser({ fullName: name, email, password });

      if (!result.ok) {
        throw new Error(result.message);
      }

      const response = result.data as AuthResponse;
      setAuthToken(response.accessToken, false);
      setUserInfo(response.user);
      setUser(response.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    const { logoutUser } = await import("@/lib/api");
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
    clearAuthToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: AuthUser) => {
    setUserInfo(updatedUser);
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}
