import { create } from 'zustand';
import { AttendanceRecord } from '@/types/attendance.types';
import { attendanceService } from '@/services/attendanceService';

interface AttendanceStore {
  records: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;

  fetchAttendance: (internId: string) => Promise<void>;
  markAttendance: (date: string, checkIn: string) => Promise<void>;
  clearError: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  records: [],
  isLoading: false,
  error: null,

  fetchAttendance: async (internId) => {
    set({ isLoading: true, error: null });
    try {
      const records = await attendanceService.getByInternId(internId);
      set({ records, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Failed to load attendance' });
    }
  },

  markAttendance: async (date, checkIn) => {
    try {
      const record = await attendanceService.mark({ date, checkIn });
      set((state) => ({ records: [record, ...state.records] }));
    } catch (err: any) {
      set({ error: err?.message || 'Failed to mark attendance' });
    }
  },

  clearError: () => set({ error: null }),
}));
