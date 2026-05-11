import api from './api';
import { PROFILE_ENDPOINTS } from '@/constants/api';
import { User, Intern } from '@/types/auth.types';

export const profileService = {
  getUserById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(PROFILE_ENDPOINTS.GET_USER, {
      params: { id }
    });
    // The API might return an array or single object
    return Array.isArray(data) ? data[0] : data;
  },

  getInternByUserId: async (userId: string): Promise<Intern | null> => {
    const { data } = await api.get(PROFILE_ENDPOINTS.GET_INTERN, {
      params: { user_id: userId }
    });
    console.log('[profileService] getInternByUserId raw response:', JSON.stringify(data));
    // Handle array or single object responses
    const intern = Array.isArray(data) ? data[0] : data;
    return intern ?? null;
  },

  updateUser: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, payload);
    return data;
  },
};
