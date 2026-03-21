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
  message: string;
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

// ── Helper to call CSRF cookie ──────────────────────────────
async function getCsrfCookie() {
  await fetch('http://localhost:8000/sanctum/csrf-cookie', {
    method: 'GET',
    credentials: 'include',
  });
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
  login: async (body: { email: string; password: string }) => {
    await getCsrfCookie(); // Ensure CSRF cookie is set before login

    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * POST /auth/logout
   */
  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  /**
   * GET /auth/me
   */
  me: () =>
    request<MeResponse>('/auth/me', {
      method: 'GET',
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
  resendVerification: () =>
    request<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      
    }),
};

