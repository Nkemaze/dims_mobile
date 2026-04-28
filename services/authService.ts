import api from './api';
import { AUTH_ENDPOINTS } from '@/constants/api';
import { LoginPayload, LoginResponse } from '@/types/auth.types';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
  },

  getMe: async () => {
    const { data } = await api.get(AUTH_ENDPOINTS.ME);
    return data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  },
};
