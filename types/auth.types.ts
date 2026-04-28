export interface Intern {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  supervisorId?: string;
  startDate?: string;
  endDate?: string;
  avatarUrl?: string;
}

export interface AuthState {
  token: string | null;
  user: Intern | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Intern;
}
