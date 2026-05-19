import api from './api';
import { SUPERVISOR_ENDPOINTS } from '@/constants/api';
import { Supervisor } from '@/types/supervisor.types';

export const supervisorService = {
  getById: async (id: string): Promise<Supervisor | null> => {
    try {
      const { data } = await api.get<Supervisor[] | Supervisor>(SUPERVISOR_ENDPOINTS.GET_BY_ID(id));
      // The API might return an array or an object directly
      const supervisor = Array.isArray(data) ? data[0] : data;
      return supervisor || null;
    } catch (error) {
      console.error('Failed to load supervisor details:', error);
      return null;
    }
  },
};
