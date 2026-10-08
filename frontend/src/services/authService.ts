import {
  getCurrentUser,
  loginUser,
  registerUser
} from "../api/authApi";
import type {
  LoginRequest,
  RegisterRequest
} from "../types/auth";

export const authService = {
  login: (request: LoginRequest) => loginUser(request),
  register: (request: RegisterRequest) => registerUser(request),
  getCurrentUser: () => getCurrentUser()
};