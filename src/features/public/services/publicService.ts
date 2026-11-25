import { apiClient } from '../../../services/api/client';
import { PublicInvoice, ShareContext, InvoiceRequestData } from '../../../types';

export const getPublicInvoice = async (invoiceId: string): Promise<PublicInvoice> => {
  // This endpoint should be public or require a secure token in the URL
  return apiClient(`/api/v1/public/invoices/${invoiceId}`);
};

export const verifyPublicPayment = async (data: {
  reference: string;
  invoice_id: string;
  client_name: string;
}): Promise<{ success: boolean; message: string }> => {
  return apiClient('/api/v1/public/paystack/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const verifyShareToken = async (token: string): Promise<ShareContext> => {
  return apiClient(`/api/v1/public/invoice-request/verify?token=${encodeURIComponent(token)}`);
};

export const submitInvoiceRequest = async (token: string, data: InvoiceRequestData): Promise<{ message: string }> => {
  return apiClient(`/api/v1/public/invoice-request/submit?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};