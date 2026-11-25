import { apiClient } from '../../../services/api/client';
import { Client } from '../../../types';

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export const getClients = async (search?: string): Promise<Client[]> => {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiClient(`/api/v1/clients${params}`);
};

export const createClient = async (data: CreateClientData): Promise<Client> => {
  return apiClient('/api/v1/clients', { method: 'POST', body: JSON.stringify(data) });
};

export const updateClient = async (id: string, data: CreateClientData): Promise<Client> => {
  return apiClient(`/api/v1/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteClient = async (id: string): Promise<{ message: string }> => {
  return apiClient(`/api/v1/clients/${id}`, { method: 'DELETE' });
};