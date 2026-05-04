import api from './api';
import { PROFILE_ENDPOINTS } from '@/constants/api';
import { Intern } from '@/types/auth.types';

export const profileService = {
  getById: async (id: string): Promise<Intern> => {
    const { data } = await api.get<Intern>(PROFILE_ENDPOINTS.GET_BY_ID(id));
    return data;
  },

  update: async (id: string, payload: Partial<Intern>): Promise<Intern> => {
    const { data } = await api.put<Intern>(PROFILE_ENDPOINTS.UPDATE(id), payload);
    return data;
  },
};
