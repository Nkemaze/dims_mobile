import api from './api';
import { INTERNSHIP_APPLICATION_ENDPOINTS, INTERNSHIP_POSITION_ENDPOINTS } from '@/constants/api';
import { InternshipApplication, InternshipPosition, ApprovedPosition } from '@/types/internship.types';

export const internshipService = {
  getApprovedInternshipPositions: async (userId: string): Promise<ApprovedPosition[]> => {
    try {
      // Fetch internship applications for the user
      // Note: _dbname=dims is automatically appended by the api interceptor
      const applicationsRes = await api.get<InternshipApplication[]>(
        INTERNSHIP_APPLICATION_ENDPOINTS.GET_INTERN_APPLICATIONS,
        {
          params: { user_id: userId },
        }
      );
      
      const applications = applicationsRes.data || [];
      const accepted = applications.filter((a) => a.status === "Accepted");
      const positionIds = [...new Set(accepted.map((a) => a.internshipposition_id))];

      if (positionIds.length === 0) {
        return [];
      }

      // Fetch all internship positions
      const positionsRes = await api.get<InternshipPosition[]>(
        INTERNSHIP_POSITION_ENDPOINTS.GET_ALL
      );
      
      const allPositions = positionsRes.data || [];

      // Map to ApprovedPosition objects
      return positionIds.map((id) => {
        const pos = allPositions.find((p) => p.id === id);
        return {
          id,
          name: pos ? pos.title_en || pos.title_fr || "Unknown Position" : "Unknown Position",
        };
      });
    } catch (error) {
      console.error('Error fetching approved internship positions:', error);
      return [];
    }
  },
};
