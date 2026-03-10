/**
 * API Index
 * Re-exports all API modules
 */

export { authApi } from './auth';
export { coursesApi } from './courses';
export { lessonsApi } from './lessons';
export { flashcardsApi } from './flashcards';
export { testsApi } from './tests';
export { dashboardApi, getUserInitials, formatJlptLevel } from './dashboard';

// Re-export request utilities
export { request, getAuthToken, setAuthToken, removeAuthToken } from './request';
export type { ApiResponse } from './request';

