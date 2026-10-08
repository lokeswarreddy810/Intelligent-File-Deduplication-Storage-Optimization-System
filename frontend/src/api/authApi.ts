import apiClient from "./axios";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User
} from "../types/auth";

export const registerUser = async (
  request: RegisterRequest
): Promise<User> => {
  const response = await apiClient.post<User>(
    "/auth/register",
    request
  );

  return response.data;
};

export const loginUser = async (
  request: LoginRequest
): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>(
    "/auth/login",
    request
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");

  return response.data;
};