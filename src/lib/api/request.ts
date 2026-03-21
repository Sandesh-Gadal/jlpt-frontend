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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  if (!match) return null;

  return decodeURIComponent(match.split('=')[1]);
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
     const xsrfToken = getCookie('XSRF-TOKEN');
    const res = await fetch(`${BASE}${path}`, {
      ...options,
       credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
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

// ── Token key ────────────────────────────────────────────────
// const TOKEN_KEY = 'jlpt_token';

// /**
//  * Sanitise whatever comes out of localStorage.
//  * Guards against the old bug where the full user JSON
//  * got concatenated onto the token string:
//  * e.g.  "25|9tJNHg...{"id":"019c..."}"
//  */
// function sanitiseToken(raw: string): string {
//   // If a JSON object was appended, strip everything from '{' onward
//   const braceIdx = raw.indexOf('{');
//   return braceIdx !== -1 ? raw.slice(0, braceIdx).trim() : raw.trim();
// }

// /**
//  * Get the auth token from localStorage.
//  * Returns null on server or if no token is stored.
//  */
// export function getAuthToken(): string | null {
//   if (typeof window === 'undefined') return null;
//   try {
//     const raw = localStorage.getItem(TOKEN_KEY);
//     if (!raw) return null;
//     const token = sanitiseToken(raw);
//     // If sanitising changed the value, write the clean version back
//     if (token !== raw) localStorage.setItem(TOKEN_KEY, token);
//     return token || null;
//   } catch {
//     return null;
//   }
// }

// /**
//  * Store only the token string — never anything else.
//  */
// export function setAuthToken(token: string): void {
//   if (typeof window === 'undefined') return;
//   try {
//     // Remove any old insecure user object that may have been stored
//     localStorage.removeItem('jlpt_user');
//     localStorage.setItem(TOKEN_KEY, sanitiseToken(token));
//   } catch {}
// }

// /**
//  * Remove the auth token and any legacy keys.
//  */
// export function removeAuthToken(): void {
//   if (typeof window === 'undefined') return;
//   try {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem('jlpt_user'); // legacy — remove if still present
//   } catch {}
// }