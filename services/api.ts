import axios from 'axios';
import { API_BASE_URL, AUTH_BASE_URL } from '@/constants/api';
import { storage } from '@/utils/storage';

// ─── Main API Instance ──────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Auth API Instance ──────────────────────────────────────────────────────
const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach JWT ─────────────────────────────────────────
const attachToken = async (config: any) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken, (error) => Promise.reject(error));
authApi.interceptors.request.use(attachToken, (error) => Promise.reject(error));

// ─── Response Interceptor: Handle 401 ────────────────────────────────────────
const handle401 = async (error: any) => {
  if (error.response?.status === 401) {
    // Token expired — clear session
    await storage.clearAll();
    // Navigation to login is handled by the auth store/guard
  }
  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, handle401);
authApi.interceptors.response.use((response) => response, handle401);

export { authApi };
export default api;
