import api from './api';

export const reviewService = {
  getMyReviews: () => api.get('/reviews/my'),
  getBookReviews: (bookId) => api.get(`/reviews/book/${bookId}`),
  create: (data) => api.post('/reviews', data),
};
