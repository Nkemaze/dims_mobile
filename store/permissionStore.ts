import { create } from 'zustand';
import { PermissionRequest, CreatePermissionPayload } from '@/types/permission.types';
import { permissionService } from '@/services/permissionService';

interface PermissionStore {
  permissions: PermissionRequest[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchPermissions: (internId: string) => Promise<void>;
  createPermission: (payload: CreatePermissionPayload) => Promise<boolean>;
  clearError: () => void;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  permissions: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchPermissions: async (internId) => {
    set({ isLoading: true, error: null });
    try {
      const permissions = await permissionService.getByInternId(internId);
      set({ permissions, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Failed to load permissions' });
    }
  },

  createPermission: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const newPermission = await permissionService.create(payload);
      set((state) => ({
        permissions: [newPermission, ...state.permissions],
        isSubmitting: false,
      }));
      return true;
    } catch (err: any) {
      set({ isSubmitting: false, error: err?.message || 'Failed to submit permission request' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
