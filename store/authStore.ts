import { create } from 'zustand';
import { User, Intern } from '@/types/auth.types';
import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';
import { storage, cache } from '@/utils/storage';

interface AuthStore {
  user: User | null;
  intern: Intern | null;
  token: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<{ success: boolean; isVerified?: boolean; message?: string }>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  ensureIntern: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; message: string }>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  intern: null,
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
        const { token, user: loginUser, isVerified } = response;

        if (isVerified === false) {
          set({ isLoading: false, isVerified: false });
          return { success: true, isVerified: false, message: response.message };
        }

        await storage.saveToken(token);

        // Hydrate User and Intern profiles from DIMS API
        let fullUser = loginUser;
        let internInfo = null;
        try {
          const userProfile = await profileService.getUserById(loginUser.id);
          if (userProfile) fullUser = { ...loginUser, ...userProfile };

          internInfo = await profileService.getInternByUserId(loginUser.id);
        } catch (profileError) {
          console.warn('Failed to fetch full profiles during login:', profileError);
        }

        await storage.saveUser(fullUser);
        if (internInfo) {
          await storage.saveIntern(internInfo);
        }

        set({
          token,
          user: fullUser,
          intern: internInfo,
          isAuthenticated: true,
          isVerified: true,
          isLoading: false
        });
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
      // Clear auth storage AND all offline-cached data
      await Promise.all([storage.clearAll(), cache.clearAll()]);
      set({ user: null, intern: null, token: null, isAuthenticated: false, isVerified: true });
    }
  },

  loadSession: async () => {
    const token = await storage.getToken();
    const user = await storage.getUser<User>();
    if (token && user) {
      // Load intern from storage first (fast path); fall back to network if missing
      let intern = await storage.getIntern<Intern>();
      if (!intern) {
        try {
          intern = await profileService.getInternByUserId(user.id);
          if (intern) await storage.saveIntern(intern);
        } catch (e) {
          console.warn('Failed to fetch intern on session load:', e);
        }
      }
      set({ token, user, intern, isAuthenticated: true });
    }
  },

  /**
   * Fetches and persists the intern profile if it is missing from the store.
   * Safe to call multiple times — exits immediately if intern is already loaded
   * or if no authenticated user is available.
   */
  ensureIntern: async () => {
    const { intern, user } = get();
    if (intern || !user) return;
    try {
      const fetchedIntern = await profileService.getInternByUserId(user.id);
      if (fetchedIntern) {
        await storage.saveIntern(fetchedIntern);
        set({ intern: fetchedIntern });
      }
    } catch (e) {
      console.warn('[authStore] ensureIntern failed:', e);
    }
  },

  /**
   * Force-refreshes both user and intern profiles from the API.
   * Unlike ensureIntern, this always re-fetches even if data is already present.
   * Use this for pull-to-refresh on profile-related screens.
   */
  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    try {
      const [freshUser, freshIntern] = await Promise.all([
        profileService.getUserById(user.id),
        profileService.getInternByUserId(user.id),
      ]);
      if (freshUser) {
        await storage.saveUser(freshUser);
        set({ user: freshUser });
      }
      if (freshIntern) {
        await storage.saveIntern(freshIntern);
        set({ intern: freshIntern });
      }
    } catch (e) {
      console.warn('[authStore] refreshProfile failed:', e);
    }
  },

  clearError: () => set({ error: null }),

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.forgotPassword(email);
      set({ isLoading: false });
      return { success: true, message: response?.message || 'Password reset code sent to your email.' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset code';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.resetPassword(token, password);
      set({ isLoading: false });
      return { success: true, message: response?.message || 'Password reset successful.' };
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
