import { apiClient } from '../../../services/api/client';
import { Payment, PaymentSummary } from '../../../types';

export interface GetPaymentsParams {
  search?: string;
  status?: 'all' | 'paid' | 'pending' | 'overdue' | 'failed';
}

export const getPayments = async (params: GetPaymentsParams = {}): Promise<Payment[]> => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiClient(`/api/v1/payments${queryString}`);
};

export const getPaymentSummary = async (): Promise<PaymentSummary> => {
  return apiClient('/api/v1/payments/summary');
};

export const getPaymentDetails = async (paymentId: string): Promise<Payment> => {
  return apiClient(`/api/v1/payments/${paymentId}`);
};