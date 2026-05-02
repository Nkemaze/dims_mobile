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

      // Handle the case where the API returns 400 but includes isVerified: false
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
}));
