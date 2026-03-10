/**
 * Base request function for API calls
 * Used by all API modules
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers ?? {}),
      },
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message ?? 'Something went wrong.', status: res.status };
    return { data, status: res.status };
  } catch {
    return { error: 'Network error. Please try again.', status: 0 };
  }
}

/**
 * Get the auth token from localStorage/sessionStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jlpt_token');
}

/**
 * Set the auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jlpt_token', token);
}

/**
 * Remove the auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jlpt_token');
}

