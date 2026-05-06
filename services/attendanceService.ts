import api from './api';
import { ATTENDANCE_ENDPOINTS } from '@/constants/api';
import { AttendanceRecord, MarkAttendancePayload } from '@/types/attendance.types';

export const attendanceService = {
  getByInternId: async (internId: string): Promise<AttendanceRecord[]> => {
    const { data } = await api.get<AttendanceRecord[]>(ATTENDANCE_ENDPOINTS.GET_ALL, {
      params: { intern_id: internId }
    });
    return data;
  },

  mark: async (payload: MarkAttendancePayload): Promise<AttendanceRecord> => {
    const { data } = await api.post<AttendanceRecord>(ATTENDANCE_ENDPOINTS.CREATE, payload);
    return data;
  },
};
