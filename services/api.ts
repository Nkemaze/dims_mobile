import axios from 'axios';
import { API_BASE_URL, AUTH_BASE_URL, DIMS_DB } from '@/constants/api';
import { storage } from '@/utils/storage';

// ─── Main API Instance (DIMS DB) ─────────────────────────────────────────────
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

// ─── Request Interceptor: Attach JWT and DB Name ─────────────────────────────
const attachTokenAndDB = async (config: any) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // For the main API, always append _dbname=dims if not already present
  if (config.baseURL === API_BASE_URL) {
    config.params = {
      ...config.params,
      _dbname: DIMS_DB,
    };
  }

  return config;
};

api.interceptors.request.use(attachTokenAndDB, (error) => Promise.reject(error));
authApi.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ─── Response Interceptor: Handle 401 ────────────────────────────────────────
const handle401 = async (error: any) => {
  if (error.response?.status === 401) {
    await storage.clearAll();
  }
  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, handle401);
authApi.interceptors.response.use((response) => response, handle401);

export { authApi };
export default api;
