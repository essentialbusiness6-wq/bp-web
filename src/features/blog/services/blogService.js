import { apiClient } from '../../../services/api/client';

export const getBlogPosts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient(`/api/v1/blog/posts${queryString}`);
};