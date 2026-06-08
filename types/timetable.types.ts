export interface TimetableEntry {
  id: string;
  title: string;
  description?: string;
  dayOfWeek?: string;
  startTime: string;
  endTime: string;
  location?: string;
  internId?: string;
  // Real API properties
  activity_name?: string;
  activity_description?: string;
  activity_date?: string;
  start_time?: string;
  end_time?: string;
  internship_position_title?: string | null;
  supervisor_fullname?: string | null;
  // Mapped properties
  activityDate?: string;
  internshipPositionTitle?: string | null;
  supervisorFullname?: string | null;
}
