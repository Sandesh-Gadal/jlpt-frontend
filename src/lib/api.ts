const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
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

export const api = {
  register: (body: {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: { id: string; email: string; full_name: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(body) }
    ),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (body: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  resendVerification: (token: string) =>
    request('/auth/resend-verification', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),
};
