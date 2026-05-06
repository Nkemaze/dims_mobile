// ─── App API Base URLs ──────────────────────────────────────────────────────
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
export const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_BASE_URL || 'http://localhost:3001/api/auth';

// ─── Database Names ──────────────────────────────────────────────────────────
export const DIMS_DB = 'dims';

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
  GET_ALL: '/tasks',
  GET_BY_ID: (id: string) => `/tasks/${id}`,
  UPDATE: (id: string) => `/tasks/${id}`,
};

export const INTERN_ENDPOINTS = {
  GET_ALL: '/interns',
  GET_BY_ID: (id: string) => `/interns/${id}`,
};

export const USER_ENDPOINTS = {
  GET_ALL: '/users',
  GET_BY_ID: (id: string) => `/users/${id}`,
};

export const ATTENDANCE_ENDPOINTS = {
  GET_ALL: '/attendances',
  CREATE: '/attendances',
};

export const TIMETABLE_ENDPOINTS = {
  GET_ALL: '/timetables',
  GET_BY_ID: (id: string) => `/timetables/${id}`,
};

export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications',
  UPDATE: (id: string) => `/notifications/${id}`,
};

export const PROFILE_ENDPOINTS = {
  GET_USER: '/users',
  GET_INTERN: '/v1/interns',
};
