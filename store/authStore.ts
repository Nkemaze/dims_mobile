import { create } from 'zustand';
import { Intern } from '@/types/auth.types';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';

interface AuthStore {
  user: Intern | null;
  token: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<{ success: boolean; isVerified?: boolean; message?: string }>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; message: string }>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isVerified: true,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        const { token, user, isVerified } = response;

        if (isVerified === false) {
          set({ isLoading: false, isVerified: false });
          return { success: true, isVerified: false, message: response.message };
        }

        await storage.saveToken(token);
        await storage.saveUser(user);
        set({ token, user, isAuthenticated: true, isVerified: true, isLoading: false });
        return { success: true, isVerified: true };
      } else {
        set({ isLoading: false, error: response.message || 'Login failed' });
        return { success: false, message: response.message };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      set({ isLoading: false, error: errorMessage });

      if (err.response?.data?.isVerified === false) {
        set({ isVerified: false });
        return { success: false, isVerified: false, message: errorMessage };
      }

      return { success: false, message: errorMessage };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storage.clearAll();
      set({ user: null, token: null, isAuthenticated: false, isVerified: true });
    }
  },

  loadSession: async () => {
    const token = await storage.getToken();
    const user = await storage.getUser<Intern>();
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },

  clearError: () => set({ error: null }),

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.forgotPassword(email);
      set({ isLoading: false });
      return { success: true, message: 'Password reset code sent to your email.' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset code';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(token, password);
      set({ isLoading: false });
      return { success: true, message: 'Password reset successful.' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.verifyEmail(code);
      if (response.success) {
        set({ isLoading: false, isVerified: true });
        return { success: true, message: response.message || 'Email verified successfully.' };
      } else {
        set({ isLoading: false, error: response.message || 'Verification failed' });
        return { success: false, message: response.message };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Verification failed';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },
}));
