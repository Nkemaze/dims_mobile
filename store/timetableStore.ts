import { create } from 'zustand';
import { TimetableEntry } from '@/types/timetable.types';
import { timetableService } from '@/services/timetableService';

interface TimetableStore {
  entries: TimetableEntry[];
  isLoading: boolean;
  error: string | null;

  fetchTimetable: () => Promise<void>;
  clearError: () => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchTimetable: async () => {
    set({ isLoading: true, error: null });
    try {
      // Documentation suggests timetables are general or filtered by some other param
      const entries = await timetableService.getAll();
      set({ entries, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Failed to load timetable' });
    }
  },

  clearError: () => set({ error: null }),
}));
