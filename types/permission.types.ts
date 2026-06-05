export type PermissionStatus = 'pending' | 'approved' | 'rejected';

export interface PermissionRequest {
  id: string;
  intern_id: string;
  reason: string;
  start_date: string;      // ISO datetime string
  end_date: string | null; // ISO datetime string or null
  status: PermissionStatus;
}

export interface CreatePermissionPayload {
  intern_id: string;
  reason: string;
  start_date: string;
  end_date: string | null;
}
