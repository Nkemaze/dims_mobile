// Real API status values from the backend
export type AttendanceStatus = 'Present' | 'Absent' | 'Other';

// Matches the actual API response shape from /attendances
export interface AttendanceRecord {
  id: string;
  intern_id: string;
  attendance_date: string; // ISO date string e.g. "2025-06-01T00:00:00.000Z"
  status: AttendanceStatus;
  created_at?: string;
  updated_at?: string;
}

export interface MarkAttendancePayload {
  intern_id: string;
  attendance_date: string;
  status: AttendanceStatus;
}
