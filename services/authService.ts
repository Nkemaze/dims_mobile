import { authApi } from './api';
import { AUTH_ENDPOINTS } from '@/constants/api';
import { LoginPayload, LoginResponse, SignupPayload, SignupResponse } from '@/types/auth.types';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await authApi.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await authApi.post(AUTH_ENDPOINTS.LOGOUT);
  },

  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const { data } = await authApi.post<SignupResponse>(AUTH_ENDPOINTS.SIGNUP, payload);
    return data;
  },

  signupAdmin: async (payload: SignupPayload & { cont: string }): Promise<SignupResponse> => {
    const { data } = await authApi.post<SignupResponse>(AUTH_ENDPOINTS.SIGNUP_ADMIN, payload);
    return data;
  },

  checkAuth: async () => {
    const { data } = await authApi.get(AUTH_ENDPOINTS.CHECK_AUTH);
    return data;
  },

  verifyEmail: async (code: string): Promise<any> => {
    const { data } = await authApi.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { code });
    return data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await authApi.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await authApi.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password });
  },

  tokenExpire: async (): Promise<any> => {
    const { data } = await authApi.post(AUTH_ENDPOINTS.TOKEN_EXPIRE);
    return data;
  },

  getTokenInfo: async (): Promise<any> => {
    const { data } = await authApi.post(AUTH_ENDPOINTS.GET_TOKEN_INFO);
    return data;
  },

  visitorToken: async (): Promise<any> => {
    const { data } = await authApi.post(AUTH_ENDPOINTS.VISITOR_TOKEN);
    return data;
  }
};
