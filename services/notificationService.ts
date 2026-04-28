import api from './api';
import { NOTIFICATION_ENDPOINTS } from '@/constants/api';
import { Notification } from '@/types/notification.types';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get<Notification[]>(NOTIFICATION_ENDPOINTS.GET_ALL);
    return data;
  },

  markRead: async (id: string): Promise<void> => {
    await api.patch(NOTIFICATION_ENDPOINTS.MARK_READ(id));
  },
};
