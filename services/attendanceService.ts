import api from './api';
import { ATTENDANCE_ENDPOINTS } from '@/constants/api';
import { AttendanceRecord, MarkAttendancePayload } from '@/types/attendance.types';

export const attendanceService = {
  getAll: async (internId?: string): Promise<AttendanceRecord[]> => {
    const params = internId ? { internId } : {};
    const { data } = await api.get<AttendanceRecord[]>(ATTENDANCE_ENDPOINTS.GET_ALL, { params });
    return data;
  },

  mark: async (payload: MarkAttendancePayload): Promise<AttendanceRecord> => {
    const { data } = await api.post<AttendanceRecord>(ATTENDANCE_ENDPOINTS.CREATE, payload);
    return data;
  },
};
