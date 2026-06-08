import { create } from 'zustand';
import { TimetableEntry } from '@/types/timetable.types';
import { timetableService } from '@/services/timetableService';
import { cache } from '@/utils/storage';

const CACHE_KEY = 'timetable';

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
    // 1. Load cached entries immediately
    const cached = await cache.get<TimetableEntry[]>(CACHE_KEY);
    if (cached && cached.length > 0) {
      set({ entries: cached });
    }

    // 2. Fetch fresh from network
    set({ isLoading: !cached || cached.length === 0, error: null });
    try {
      const entries = await timetableService.getAll();
      set({ entries, isLoading: false });
      await cache.set(CACHE_KEY, entries);
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Failed to load timetable' });
    }
  },

  clearError: () => set({ error: null }),
}));
