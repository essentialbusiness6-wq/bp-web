import { apiClient } from '../../../services/api/client';

export interface MeOverview {
  balance: number;
  currency: string;
}

export const getMeOverview = async (): Promise<MeOverview> => {
  return apiClient('/api/v1/me/overview');
};