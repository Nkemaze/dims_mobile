import { useAttendanceStore } from '@/store/attendanceStore';

/**
 * Exposes attendance state and actions.
 * NOTE: Does NOT auto-fetch on mount — callers are responsible for
 * triggering fetchAttendance (e.g. via useFocusEffect) so each screen
 * controls when a network call happens.
 */
export const useAttendance = () => {
  const records = useAttendanceStore((s) => s.records);
  const isLoading = useAttendanceStore((s) => s.isLoading);
  const error = useAttendanceStore((s) => s.error);
  const fetchAttendance = useAttendanceStore((s) => s.fetchAttendance);
  const clearError = useAttendanceStore((s) => s.clearError);

  return { records, isLoading, error, fetchAttendance, clearError };
};
