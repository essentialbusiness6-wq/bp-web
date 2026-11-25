import { apiClient } from '../../../services/api/client';
import { User } from '../../../types';

export interface LoginCredentials {
  username: string; // Can be email or username
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  message: string;
  requires_2fa?: boolean;
  temp_token?: string;
  user?: User;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}



export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return apiClient('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  return apiClient('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const forgotPassword = async (data: ForgotPasswordData): Promise<AuthResponse> => {
  return apiClient('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const resetPassword = async (data: ResetPasswordData): Promise<AuthResponse> => {
  return apiClient('/api/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return apiClient('/api/v1/auth/me');
};

export const logoutUser = async (): Promise<void> => {
  return apiClient('/api/v1/auth/logout', { method: 'POST' });
};



export const verify2FA = async (data: { temp_token: string; code: string }): Promise<LoginResponse> => {
  return apiClient('/api/v1/auth/verify-2fa', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const verifyBackupCode = async (data: { temp_token: string; backup_code: string }): Promise<LoginResponse> => {
  return apiClient('/api/v1/auth/verify-backup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const googleSignIn = async (data: { credential: string }): Promise<LoginResponse> => {
  return apiClient('/api/v1/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};