import { apiClient } from '../../../services/api/client';
import { Draft, Invoice } from '../../../types';

export interface GetDraftsParams {
  sort?: 'recent' | 'client' | 'date';
}

export const getDrafts = async (params: GetDraftsParams = {}): Promise<Draft[]> => {
  const queryParams = new URLSearchParams();
  if (params.sort) queryParams.append('sort', params.sort);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return apiClient(`/api/v1/drafts${queryString}`);
};

export const createDraft = async (data: any): Promise<Draft> => {
  return apiClient('/api/v1/drafts', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  });
};

export const updateDraft = async (id: string, data: any): Promise<Draft> => {
  return apiClient(`/api/v1/drafts/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  });
};

export const deleteDraft = async (draftId: string): Promise<{ message: string }> => {
  return apiClient(`/api/v1/drafts/${draftId}`, { method: 'DELETE' });
};

export const convertDraftToInvoice = async (draftId: string): Promise<{ message: string; invoice_id: string }> => {
  return apiClient(`/api/v1/drafts/${draftId}/convert`, { method: 'POST' });
};