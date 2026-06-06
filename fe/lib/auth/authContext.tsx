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
  clearUserInfo,
} from "@/lib/auth/tokenStorage";

export type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
};

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {
    throw new Error("AuthProvider is not ready.");
  },
  register: async () => {
    throw new Error("AuthProvider is not ready.");
  },
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
        const storedUser = getUserInfo<AuthUser>();

        if (token || storedUser) {
          const { getCurrentUser } = await import("@/lib/api/auth");
          const result = await getCurrentUser();

          if (!result.ok || !result.data) {
            clearAuthToken();
            clearUserInfo();
            setUser(null);
            return;
          }

          setUserInfo(result.data);
          setUser(result.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        clearAuthToken();
        clearUserInfo();
        setUser(null);
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
      return response.user;
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
      return response.user;
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
    clearUserInfo();
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
