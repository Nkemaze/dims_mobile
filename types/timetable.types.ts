export interface TimetableEntry {
  id: string;
  title: string;
  description?: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  startTime: string;
  endTime: string;
  location?: string;
  internId: string;
}
