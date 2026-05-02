// ─── App API Base URLs ──────────────────────────────────────────────────────
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.digimarkconsulting.cm/api/v1';
export const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_BASE_URL || 'https://auth.digimarkconsulting.cm/api/auth';

// For backward compatibility if needed
export const BASE_URL = API_BASE_URL;

// ─── Auth Endpoints ──────────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  SIGNUP: '/signup',
  SIGNUP_ADMIN: '/signupA',
  VERIFY_EMAIL: '/verify-email',
  CHECK_AUTH: '/check-auth',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  TOKEN_EXPIRE: '/token_expire',
  GET_TOKEN_INFO: '/get_token_info',
  VISITOR_TOKEN: '/visitor_token',
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
