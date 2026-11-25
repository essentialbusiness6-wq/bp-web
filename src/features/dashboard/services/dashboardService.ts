import { apiClient } from '../../../services/api/client';
import { DashboardData, ShareLinkResponse } from '../../../types';
export const getDashboardData = async (): Promise<DashboardData> => {
  return apiClient('/api/v1/dashboard/data');
};
export const generateShareLink = async (invoiceId: string): Promise<ShareLinkResponse> => {
  return apiClient('/api/v1/invoices/share-link', {
    method: 'POST',
    body: JSON.stringify({ invoice_id: invoiceId }),
  });
};

