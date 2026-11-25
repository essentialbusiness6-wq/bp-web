import { apiClient } from '../../../services/api/client';
import { Invoice } from '../../../types';

export interface GetInvoicesParams {
  status?: 'all' | 'paid' | 'pending' | 'unpaid' | 'overdue';
  page?: number;
  limit?: number;
}

export const getInvoices = async (params: GetInvoicesParams = {}): Promise<Invoice[]> => {
  const queryParams = new URLSearchParams();
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiClient(`/api/v1/invoices${queryString}`);
};

export const deleteInvoice = async (invoiceId: string): Promise<{ message: string }> => {
  return apiClient(`/api/v1/invoices/${invoiceId}`, { method: 'DELETE' });
};


export const updateInvoice = async (id: string, data: any): Promise<Invoice> => {
  return apiClient(`/api/v1/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};


export interface CreateInvoiceData {
  client_name: string;
  client_email: string;
  invoice_date: string;
  due_date: string;
  currency: string;
  items: { description: string; quantity: number; unit_price: number }[];
  tax_rate: number;
  amount_paid: number;
  notes: string;
  status: 'draft' | 'pending';
  draft_id?: string; // Optional: if converting from an existing draft
}

export const createInvoice = async (data: CreateInvoiceData): Promise<Invoice> => {
  return apiClient('/api/v1/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};


export const getInvoiceDetails = async (invoiceId: string): Promise<Invoice> => {
  return apiClient(`/api/v1/invoices/${invoiceId}`);
};

export const shareInvoice = async (invoiceId: string): Promise<{ share_link: string }> => {
  return apiClient(`/api/v1/invoices/${invoiceId}/share`, { method: 'POST' });
};


export const generateClientInvoiceLink = async (): Promise<{ share_url: string; token: string }> => {
  return apiClient('/api/v1/invoices/generate-client-link', {
    method: 'POST',
  });
};