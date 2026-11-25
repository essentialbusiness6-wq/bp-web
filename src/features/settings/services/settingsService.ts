import { apiClient } from '../../../services/api/client';
import { UserSettings, CloseAccountReason } from '../../../types';

export const getSettings = async (): Promise<UserSettings> => {
  return apiClient('/api/v1/settings');
};

export const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  return apiClient('/api/v1/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<{ message: string }> => {
  return apiClient('/api/v1/settings/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const toggle2FA = async (enable: boolean): Promise<{ message: string; secret?: string }> => {
  return apiClient('/api/v1/settings/2fa', {
    method: 'POST',
    body: JSON.stringify({ enable }),
  });
};

export const closeAccount = async (data: CloseAccountReason & { password: string }): Promise<{ message: string }> => {
  return apiClient('/api/v1/settings/close-account', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const exportData = async (): Promise<Blob> => {
  const response = await fetch('/api/v1/settings/export-data', {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to export data');
  return response.blob();
};