/**
 * Main API module
 * Re-exports all API modules for backward compatibility
 */

import { authApi } from './api/auth';

// Re-export all API modules
export { authApi } from './api/auth';
export { coursesApi } from './api/courses';
export { lessonsApi } from './api/lessons';
export { flashcardsApi } from './api/flashcards';
export { testsApi } from './api/tests';
export { dashboardApi, getUserInitials, formatJlptLevel } from './api/dashboard';
export { request, getAuthToken, setAuthToken, removeAuthToken } from './api/request';
export type { ApiResponse } from './api/request';

// Combined API object for convenience (used in login page)
export const api = {
  login: authApi.login,
  register: authApi.register,
  logout: authApi.logout,
  me: authApi.me,
  forgotPassword: authApi.forgotPassword,
  resetPassword: authApi.resetPassword,
  resendVerification: authApi.resendVerification,
};

