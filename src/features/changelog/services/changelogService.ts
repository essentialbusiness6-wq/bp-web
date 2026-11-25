import { apiClient } from '../../../services/api/client';
import { ChangelogResponse } from '../../../types';

export const getChangelogEntries = async (filter?: string): Promise<ChangelogResponse> => {
  const params = new URLSearchParams();
  if (filter && filter !== 'all') {
    params.append('category', filter);
  }
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient(`/api/v1/changelog${queryString}`);
};