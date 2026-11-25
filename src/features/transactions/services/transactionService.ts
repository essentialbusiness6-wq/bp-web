import { apiClient } from '../../../services/api/client';
import { Transaction, TransactionSummary } from '../../../types';

export const getTransactions = async (params: {
  month?: number;
  year?: number;
  status?: string;
}): Promise<Transaction[]> => {
  const queryParams = new URLSearchParams();
  if (params.month !== undefined) queryParams.append('month', params.month.toString());
  if (params.year !== undefined) queryParams.append('year', params.year.toString());
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiClient(`/api/v1/transactions${queryString}`);
};

export const getTransactionSummary = async (params: {
  month?: number;
  year?: number;
}): Promise<TransactionSummary> => {
  const queryParams = new URLSearchParams();
  if (params.month !== undefined) queryParams.append('month', params.month.toString());
  if (params.year !== undefined) queryParams.append('year', params.year.toString());
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiClient(`/api/v1/transactions/summary${queryString}`);
};

export const exportTransactions = async (params: {
  month?: number;
  year?: number;
  status?: string;
}): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  if (params.month !== undefined) queryParams.append('month', params.month.toString());
  if (params.year !== undefined) queryParams.append('year', params.year.toString());
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  
  const response = await fetch(`/api/v1/transactions/export?${queryParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to export transactions');
  return response.blob();
};