import { apiClient } from '../../../services/api/client';
import { Subscription, BillingCycle, CheckoutSessionResponse } from '../../../types';

export const getSubscription = async (): Promise<Subscription> => {
  return apiClient('/api/v1/billing/subscription');
};

export const createCheckoutSession = async (
  plan: 'basic' | 'pro',
  billing_cycle: BillingCycle
): Promise<CheckoutSessionResponse> => {
  return apiClient('/api/v1/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan, billing_cycle }),
  });
};

export const cancelSubscription = async (): Promise<{ message: string }> => {
  return apiClient('/api/v1/billing/cancel', { method: 'POST' });
};

export const verifyBillingPayment = async (reference: string) => {
  return apiClient('/api/v1/billing/verify?reference=${reference}', {method: 'GET'});
};
