import { create } from 'zustand';
import { AttendanceRecord } from '@/types/attendance.types';
import { attendanceService } from '@/services/attendanceService';
import { useAuthStore } from './authStore';
import { cache } from '@/utils/storage';

const CACHE_KEY = 'attendance';

interface AttendanceStore {
  records: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;

  fetchAttendance: () => Promise<void>;
  clearError: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  records: [],
  isLoading: false,
  error: null,

  fetchAttendance: async () => {
    // 1. Load cached data immediately so the UI has something to show offline
    const cached = await cache.get<AttendanceRecord[]>(CACHE_KEY);
    if (cached && cached.length > 0) {
      set({ records: cached });
    }

    // 2. Resolve internId from auth store
    const intern = useAuthStore.getState().intern;
    if (!intern?.id) {
      set({ isLoading: false, error: 'Intern profile not found.' });
      return;
    }

    // 3. Fetch fresh data from network (only show loading spinner if cache was empty)
    set({ isLoading: !cached || cached.length === 0, error: null });
    try {
      const records = await attendanceService.getByInternId(intern.id);
      set({ records, isLoading: false });
      // 4. Persist fresh data for next offline load
      await cache.set(CACHE_KEY, records);
    } catch (err: any) {
      // Network failed — keep showing cached data, just clear loading
      set({ isLoading: false, error: err?.message || 'Failed to load attendance' });
    }
  },

  clearError: () => set({ error: null }),
}));
