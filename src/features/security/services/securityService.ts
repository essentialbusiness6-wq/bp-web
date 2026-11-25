import { apiClient } from '../../../services/api/client';
import { SecuritySettings, ActiveSession, TwoFactorSetupData } from '../../../types';

export const getSecuritySettings = async (): Promise<SecuritySettings> => {
  return apiClient('/api/v1/security/settings');
};

export const getActiveSessions = async (): Promise<ActiveSession[]> => {
  return apiClient('/api/v1/security/sessions');
};

export const initiate2FA = async (): Promise<TwoFactorSetupData> => {
  return apiClient('/api/v1/security/2fa/initiate', { method: 'POST' });
};

export const verify2FA = async (code: string): Promise<{ success: boolean; message: string }> => {
  return apiClient('/api/v1/security/2fa/verify', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
};

export const disable2FA = async (password: string): Promise<{ success: boolean; message: string }> => {
  return apiClient('/api/v1/security/2fa/disable', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
};

export const changePassword = async (data: { current_password: string; new_password: string }): Promise<{ message: string }> => {
  return apiClient('/api/v1/security/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const revokeSession = async (sessionId: string): Promise<{ message: string }> => {
  return apiClient(`/api/v1/security/sessions/${sessionId}`, { method: 'DELETE' });
};

export const revokeAllOtherSessions = async (): Promise<{ message: string }> => {
  return apiClient('/api/v1/security/sessions/revoke-all', { method: 'POST' });
};

export const sendVerificationEmail = async (): Promise<{ message: string }> => {
  return apiClient('/api/v1/security/verify-email', { method: 'POST' });
};