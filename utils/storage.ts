import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'dims_token';
const USER_KEY = 'dims_user';

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

  // ─── Clear All ──────────────────────────────────────────────────────────
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },
};
