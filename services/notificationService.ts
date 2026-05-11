import api from './api';
import { NOTIFICATION_ENDPOINTS } from '@/constants/api';
import { Notification } from '@/types/notification.types';

export const notificationService = {
  getAll: async (internId?: string): Promise<Notification[]> => {
    const params = internId ? { internId } : {};
    const { data } = await api.get<Notification[]>(NOTIFICATION_ENDPOINTS.GET_ALL, { params });
    return data;
  },

  markRead: async (id: string): Promise<void> => {
    await api.put(NOTIFICATION_ENDPOINTS.UPDATE(id), { isRead: true });
  },
};
