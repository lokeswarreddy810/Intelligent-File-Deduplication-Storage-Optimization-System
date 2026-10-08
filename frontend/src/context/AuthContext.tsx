import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser
} from "../api/authApi";
import {
  AuthContext,
  type AuthContextValue
} from "./AuthContextDefinition";
import type {
  LoginRequest,
  RegisterRequest
} from "../types/auth";
import {
  getToken,
  removeToken,
  setToken
} from "../utils/token";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthContextValue["user"]>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const refreshUser =
    useCallback(async () => {
      const token = getToken();

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      } catch {
        removeToken();
        setUser(null);
      }
    }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const initializeAuth =
        async () => {
          try {
            await refreshUser();
          } finally {
            setIsLoading(false);
          }
        };

      void initializeAuth();
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [refreshUser]);

  const login =
    useCallback(
      async (
        request: LoginRequest
      ) => {
        const tokenResponse =
          await loginUser(request);

        setToken(
          tokenResponse.access_token
        );

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      },
      []
    );

  const register =
    useCallback(
      async (
        request: RegisterRequest
      ) => {
        await registerUser(request);

        await login({
          email: request.email,
          password: request.password
        });
      },
      [login]
    );

  const logout =
    useCallback(() => {
      removeToken();
      setUser(null);
    }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshUser
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      refreshUser
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}