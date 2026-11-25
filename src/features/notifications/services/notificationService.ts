import { apiClient } from '../../../services/api/client';
import { Notification, NotificationFilters } from '../../../types';

export const getNotifications = async (filters: NotificationFilters): Promise<Notification[]> => {
  const params = new URLSearchParams();
  if (filters.type !== 'all') params.append('type', filters.type);
  if (filters.status !== 'all') params.append('status', filters.status);
  if (filters.month !== 'all') params.append('month', filters.month);
  if (filters.year !== 'all') params.append('year', filters.year);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient(`/api/v1/notifications${queryString}`);
};

export const markAllAsRead = async (): Promise<{ message: string }> => {
  return apiClient('/api/v1/notifications/mark-all-read', { method: 'POST' });
};

export const clearAllNotifications = async (): Promise<{ message: string }> => {
  return apiClient('/api/v1/notifications/clear-all', { method: 'DELETE' });
};

export const exportNotifications = async (): Promise<Blob> => {
  const response = await fetch('/api/v1/notifications/export', {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to export notifications');
  return response.blob();
};