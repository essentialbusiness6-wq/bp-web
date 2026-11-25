import { apiClient } from '../../../services/api/client';

export interface TicketData {
  category: string;
  subject: string;
  message: string;
}

export interface Ticket {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export const submitTicket = async (data: TicketData): Promise<Ticket> => {
  return apiClient('/api/v1/support/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getMyTickets = async (): Promise<Ticket[]> => {
  return apiClient('/api/v1/support/tickets');
};