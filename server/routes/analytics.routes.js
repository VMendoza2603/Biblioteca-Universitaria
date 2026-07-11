const { Router } = require('express');
const { getSummary, getRecentReviews } = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/', protect, authorize('admin'), getSummary);
router.get('/recent-reviews', protect, authorize('admin'), getRecentReviews);

module.exports = router;
