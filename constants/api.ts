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

// ─── Intern Endpoints (v1 CRUD) ──────────────────────────────────────────────
export const TASK_ENDPOINTS = {
  GET_ALL: '/Tasks',
  GET_BY_ID: (id: string) => `/Tasks/${id}`,
  UPDATE: (id: string) => `/Tasks/${id}`,
};

export const ATTENDANCE_ENDPOINTS = {
  GET_ALL: '/Attendance',
  GET_BY_ID: (id: string) => `/Attendance/${id}`,
  CREATE: '/Attendance',
};

export const TIMETABLE_ENDPOINTS = {
  GET_ALL: '/Timetable',
  GET_BY_ID: (id: string) => `/Timetable/${id}`,
};

export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/Notifications',
  UPDATE: (id: string) => `/Notifications/${id}`,
};

export const PROFILE_ENDPOINTS = {
  GET_BY_ID: (id: string) => `/Users/${id}`,
  UPDATE: (id: string) => `/Users/${id}`,
};

// ─── Specialized Routes (v2) ─────────────────────────────────────────────────
export const V2_ENDPOINTS = {
  APPLY_INTERNSHIP: '/api/v2/apply_internship',
  APPLY_COMPETITION: '/api/v2/apply_competition',
  APPLY_TRAINING: '/api/v2/apply_training',
};
