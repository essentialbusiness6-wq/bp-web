import { apiClient } from '../../../services/api/client';

export interface RateUsData {
  rating: number;
  feedback: string;
}

export const submitRating = async (data: RateUsData): Promise<{ message: string }> => {
  return apiClient('/api/v1/rate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};