import api from './api';
import { TASK_ENDPOINTS } from '@/constants/api';
import { Task, UpdateTaskPayload } from '@/types/task.types';

export const taskService = {
  getByPositionId: async (positionId: string): Promise<Task[]> => {
    const { data } = await api.get<Task[]>(TASK_ENDPOINTS.GET_ALL, {
      params: { internshipposition_id: positionId }
    });
    return data;
  },

  getById: async (id: string): Promise<Task> => {
    const { data } = await api.get<Task>(TASK_ENDPOINTS.GET_BY_ID(id));
    return data;
  },

  updateStatus: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await api.put<Task>(TASK_ENDPOINTS.UPDATE(id), payload);
    return data;
  },
};
