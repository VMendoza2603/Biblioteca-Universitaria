const { Router } = require('express');
const { getBookReviews, getAllReviews, getMyReviews, createReview, getBookRating } = require('../controllers/review.controller');
const { protect, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/my', protect, getMyReviews);
router.get('/book/:bookId', protect, getBookReviews);
router.get('/book/:bookId/rating', protect, getBookRating);
router.get('/', protect, authorize('admin'), getAllReviews);
router.post('/', protect, createReview);

module.exports = router;
