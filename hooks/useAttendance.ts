import { useEffect } from 'react';
import { useAttendanceStore } from '@/store/attendanceStore';

export const useAttendance = () => {
  const records = useAttendanceStore((s) => s.records);
  const isLoading = useAttendanceStore((s) => s.isLoading);
  const error = useAttendanceStore((s) => s.error);
  const fetchAttendance = useAttendanceStore((s) => s.fetchAttendance);
  const markAttendance = useAttendanceStore((s) => s.markAttendance);

  useEffect(() => {
    fetchAttendance();
  }, []);

  return { records, isLoading, error, fetchAttendance, markAttendance };
};
