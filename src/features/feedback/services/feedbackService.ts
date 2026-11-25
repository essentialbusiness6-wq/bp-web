import { apiClient } from '../../../services/api/client';
import { Feedback } from '../../../types';

export const submitFeedback = async (formData: FormData): Promise<{ message: string }> => {
  return apiClient('/api/v1/feedback', {
    method: 'POST',
    body: formData, // FormData handles file uploads automatically
  });
};

export const getMyFeedback = async (): Promise<Feedback[]> => {
  return apiClient('/api/v1/feedback/my-feedback');
};