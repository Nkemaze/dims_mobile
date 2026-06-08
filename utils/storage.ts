import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'dims_token';
const USER_KEY = 'dims_user';
const INTERN_KEY = 'dims_intern';

export const storage = {
  // ─── Token ──────────────────────────────────────────────────────────────
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  // ─── User ───────────────────────────────────────────────────────────────
  async saveUser(user: object): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? (JSON.parse(data) as T) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  // ─── Intern ─────────────────────────────────────────────────────────────
  async saveIntern(intern: object): Promise<void> {
    await AsyncStorage.setItem(INTERN_KEY, JSON.stringify(intern));
  },

  async getIntern<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(INTERN_KEY);
    return data ? (JSON.parse(data) as T) : null;
  },

  async removeIntern(): Promise<void> {
    await AsyncStorage.removeItem(INTERN_KEY);
  },

  // ─── Clear All ──────────────────────────────────────────────────────────
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, INTERN_KEY]);
  },
};

// ─── Generic Cache ────────────────────────────────────────────────────────────
// Key-based JSON cache for offline-first data persistence.
// Usage: cache.set('attendance', data)  /  cache.get<T>('attendance')

export const cache = {
  async set(key: string, data: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(`dims_cache_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`[cache] Failed to save "${key}":`, e);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(`dims_cache_${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (e) {
      console.warn(`[cache] Failed to read "${key}":`, e);
      return null;
    }
  },

  async clear(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`dims_cache_${key}`);
    } catch (e) {
      console.warn(`[cache] Failed to clear "${key}":`, e);
    }
  },

  /** Remove all dims_cache_* keys — call on logout so data doesn't leak between accounts */
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('dims_cache_'));
      if (cacheKeys.length) await AsyncStorage.multiRemove(cacheKeys);
    } catch (e) {
      console.warn('[cache] Failed to clearAll:', e);
    }
  },
};
