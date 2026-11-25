import { apiClient } from '../../../services/api/client';
import { ProfileData, BankData, Bank } from '../../../types';


export const getProfile = async (): Promise<ProfileData> => {
  return apiClient('/api/v1/profile');
};

export const updateProfile = async (data: FormData | Partial<ProfileData>): Promise<ProfileData> => {
  return apiClient('/api/v1/profile', {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
  });
};

export const getBankDetails = async (): Promise<BankData | null> => {
  return apiClient('/api/v1/profile/bank');
};


export const verifyBankAccount = async (bank_code: string, account_number: string): Promise<{ account_name: string }> => {
  return apiClient('/api/v1/profile/bank/verify', {
    method: 'POST',
    body: JSON.stringify({ bank_code, account_number }),
  });
};

export const deleteAccount = async (password: string): Promise<{ message: string }> => {
  return apiClient('/api/v1/profile/delete', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
};

export const getBanks = async (): Promise<Bank[]> => {
  return apiClient('/api/v1/banks');
};

export const resolveBankAccount = async (bank_code: string, account_number: string): Promise<{ account_name: string }> => {
  return apiClient('/api/v1/banks/resolve', {
    method: 'POST',
    body: JSON.stringify({ bank_code, account_number }),
  });
};

export const updateBankDetails = async (data: { bank_code: string; account_number: string; account_name: string }): Promise<BankData> => {
  // Backend should handle Paystack subaccount creation here and return the saved data with subaccount_id
  return apiClient('/api/v1/profile/bank', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};