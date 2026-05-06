export interface User {
  id: string;
  name?: string;
  email: string;
  phonenumber?: string;
  role?: string;
}

export interface Intern {
  id: string;
  user_id: string;
  firstName?: string;
  lastName?: string;
  internshipposition_id?: string;
  department?: string;
  supervisorId?: string;
  startDate?: string;
  endDate?: string;
  avatarUrl?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  intern: Intern | null;
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
  user: User;
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
  user: User;
  message: string;
}
