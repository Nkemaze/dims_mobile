export interface Intern {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  phonenumber?: string;
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
  success: boolean;
  message: string;
  isVerified?: boolean;
  token: string;
  user: Intern;
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  phonenumber: string;
}

export interface SignupResponse {
  success: boolean;
  token: string;
  user: Intern;
  message: string;
}
