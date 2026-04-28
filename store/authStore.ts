import { create } from 'zustand';
import { Intern } from '@/types/auth.types';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';

interface AuthStore {
  user: Intern | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.login({ email, password });
      await storage.saveToken(token);
      await storage.saveUser(user);
      set({ token, user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Login failed' });
    }
  },

  logout: async () => {
    await storage.clearAll();
    set({ user: null, token: null, isAuthenticated: false });
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
