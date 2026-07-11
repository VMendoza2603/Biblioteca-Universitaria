const { Router } = require('express');
const { getMyNotifications, markAsRead, createNotification } = require('../controllers/notification.controller');
const { protect, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/me', protect, getMyNotifications);
router.put('/read', protect, markAsRead);
router.post('/', protect, authorize('admin'), createNotification);

module.exports = router;
