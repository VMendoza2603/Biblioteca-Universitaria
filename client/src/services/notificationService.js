import api from './api';

export const notificationService = {
  getMyNotifications: () => api.get('/notifications/me'),
  markAsRead: () => api.put('/notifications/read'),
  create: (data) => api.post('/notifications', data),
};
