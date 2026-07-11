import api from './api';

export const loanService = {
  getMyLoans: () => api.get('/loans/me'),
  getAll: () => api.get('/loans'),
  borrow: (bookId) => api.post('/loans', { bookId }),
  returnBook: (id) => api.put(`/loans/${id}/return`),
};
