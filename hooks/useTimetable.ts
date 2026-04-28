import { useEffect, useState } from 'react';
import { TimetableEntry } from '@/types/timetable.types';
import { timetableService } from '@/services/timetableService';

export const useTimetable = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await timetableService.getAll();
      setEntries(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load timetable');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return { entries, isLoading, error, fetchTimetable };
};
