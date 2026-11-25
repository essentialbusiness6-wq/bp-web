import { apiClient } from '../../../services/api/client';

export interface ReferralData {
  referral_code: string;
  invites_sent: number;
  signups: number;
  earned: number;
  currency: string;
}

export const getReferralData = async (): Promise<ReferralData> => {
  return apiClient('/api/v1/referral/data');
};