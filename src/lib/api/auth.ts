/**
 * Auth API
 * Handles authentication-related API calls
 */

import { request } from './request';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role?: string;
  jlpt_target_level?: string | null;
  email_verified?: boolean;
  avatar_url?: string | null;
  tenant?: {
    id: string;
    name: string;
    tenant_type: string;
    status: string;
    plan?: {
      id: string;
      name: string;
      plan_type: string;
      features: unknown;
    } | null;
  };
}

export interface MeResponse {
  user: AuthUser;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  /**
   * POST /auth/register
   */
  register: (body: RegisterData) =>
    request<{ user: AuthUser; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * POST /auth/login
   */
  login: (body: { email: string; password: string }) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * POST /auth/logout
   */
  logout: (token: string) =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * GET /auth/me
   */
  me: (token: string) =>
    request<MeResponse>('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * POST /auth/forgot-password
   */
  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /**
   * POST /auth/reset-password
   */
  resetPassword: (body: ResetPasswordData) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * POST /auth/resend-verification
   */
  resendVerification: (token: string) =>
    request<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

