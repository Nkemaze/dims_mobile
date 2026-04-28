import api from './api';
import { PROFILE_ENDPOINTS } from '@/constants/api';
import { Intern } from '@/types/auth.types';

export const profileService = {
  get: async (): Promise<Intern> => {
    const { data } = await api.get<Intern>(PROFILE_ENDPOINTS.GET);
    return data;
  },

  update: async (payload: Partial<Intern>): Promise<Intern> => {
    const { data } = await api.put<Intern>(PROFILE_ENDPOINTS.UPDATE, payload);
    return data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.patch(PROFILE_ENDPOINTS.CHANGE_PASSWORD, { oldPassword, newPassword });
  },
};
