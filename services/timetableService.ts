import api from './api';
import { TIMETABLE_ENDPOINTS } from '@/constants/api';
import { TimetableEntry } from '@/types/timetable.types';

export const timetableService = {
  getAll: async (): Promise<TimetableEntry[]> => {
    const { data } = await api.get<TimetableEntry[]>(TIMETABLE_ENDPOINTS.GET_ALL);
    return data;
  },
};
