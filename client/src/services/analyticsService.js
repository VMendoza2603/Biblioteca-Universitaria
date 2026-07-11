import api from './api';

export const analyticsService = {
  getSummary: () => api.get('/analytics'),
  getRecentReviews: (limit) => api.get(`/analytics/recent-reviews?limit=${limit || 3}`),
};
