import api from './api';
import { TIMETABLE_ENDPOINTS } from '@/constants/api';
import { TimetableEntry } from '@/types/timetable.types';

export const timetableService = {
  getAll: async (internId?: string): Promise<TimetableEntry[]> => {
    const params = internId ? { internId } : {};
    const { data } = await api.get<any[]>(TIMETABLE_ENDPOINTS.GET_ALL, { params });
    
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      const id = String(item.timetable_id || item.id || Math.random());
      const title = item.activity_name || item.title || 'No Title';
      const description = item.activity_description || item.description || '';
      const activityDate = item.activity_date ? item.activity_date.split('T')[0] : '';
      const startTime = item.start_time ? item.start_time.substring(0, 5) : (item.startTime || '');
      const endTime = item.end_time ? item.end_time.substring(0, 5) : (item.endTime || '');
      const location = item.location || '';
      const internshipPositionTitle = item.internship_position_title || '';
      const supervisorFullname = item.supervisor_fullname || '';

      // Calculate dayOfWeek if missing, or use what is returned
      let dayOfWeek = item.dayOfWeek;
      if (!dayOfWeek && item.activity_date) {
        const dateObj = new Date(item.activity_date);
        if (!isNaN(dateObj.getTime())) {
          const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
          dayOfWeek = days[dateObj.getDay()];
        }
      }

      return {
        ...item,
        id,
        title,
        description,
        startTime,
        endTime,
        location,
        dayOfWeek,
        activity_date: item.activity_date,
        activity_name: item.activity_name,
        start_time: item.start_time,
        end_time: item.end_time,
        internship_position_title: item.internship_position_title,
        supervisor_fullname: item.supervisor_fullname,
        activityDate,
        internshipPositionTitle,
        supervisorFullname,
      };
    });
  },
};
