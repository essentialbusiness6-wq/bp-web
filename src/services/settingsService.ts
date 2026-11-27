const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.businessessentia.net';

export interface UserSettings {
  invoice_prefix: string;
  next_invoice_number: number;
  default_due_date: number;
  default_tax_rate: number;
  show_tax: boolean;
  show_discount: boolean;
  footer_note: string | null;
  timezone: string;
  currency: string;
  currency_symbol: string;
  date_format: string;
  email_notifications: boolean;
  due_date_reminder: boolean;
  reminder_days_before: number;
  auto_logout_on_inactivity: boolean;
  auto_logout_minutes: number;
  require_pin_for_delete: boolean;
}

export const getSettings = async (): Promise<UserSettings> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings`, {
    method: 'GET',
    credentials: 'include', // Sends the session cookie
  });

  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }

  return response.json();
};

export const updateSettings = async (data: Partial<UserSettings>): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update settings');
  }

  return response.json();
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to change password');
  }

  return response.json();
};

export const exportData = async (): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/export`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to export data');
  }

  return response.blob();
};
