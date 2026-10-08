import { createContext } from "react";
import type {
  LoginRequest,
  RegisterRequest,
  User
} from "../types/auth";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    request: LoginRequest
  ) => Promise<void>;
  register: (
    request: RegisterRequest
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);