// ─── App API Base URL ────────────────────────────────────────────────────────
// Replace with your actual backend URL
export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// ─── Auth Endpoints ──────────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  ME: '/auth/me',
};

// ─── Intern Endpoints ────────────────────────────────────────────────────────
export const TASK_ENDPOINTS = {
  GET_ALL: '/tasks',
  GET_BY_ID: (id: string) => `/tasks/${id}`,
  UPDATE_STATUS: (id: string) => `/tasks/${id}/status`,
};

export const ATTENDANCE_ENDPOINTS = {
  GET_ALL: '/attendance',
  MARK: '/attendance/mark',
};

export const TIMETABLE_ENDPOINTS = {
  GET_ALL: '/timetable',
};

export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications',
  MARK_READ: (id: string) => `/notifications/${id}/read`,
};

export const PROFILE_ENDPOINTS = {
  GET: '/profile',
  UPDATE: '/profile',
  CHANGE_PASSWORD: '/profile/change-password',
};
