import api from './api';
import { PermissionRequest, CreatePermissionPayload } from '@/types/permission.types';

const ENDPOINT = '/permissionrequests';

export const permissionService = {
  getByInternId: async (internId: string): Promise<PermissionRequest[]> => {
    const { data } = await api.get<PermissionRequest[]>(ENDPOINT, {
      params: { intern_id: internId },
    });
    return data;
  },

  create: async (payload: CreatePermissionPayload): Promise<PermissionRequest> => {
    const { data } = await api.post<PermissionRequest>(ENDPOINT, payload);
    return data;
  },
};
