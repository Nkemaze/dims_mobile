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

  getInternByUserId: async (userId: string): Promise<Intern> => {
    const { data } = await api.get<Intern[]>(PROFILE_ENDPOINTS.GET_INTERN, {
      params: { user_id: userId }
    });
    return data[0];
  },

  updateUser: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, payload);
    return data;
  },
};
