const { Router } = require('express');
const { getMyLoans, getAllLoans, borrowBook, returnBook } = require('../controllers/loan.controller');
const { protect, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/me', protect, getMyLoans);
router.get('/', protect, authorize('admin'), getAllLoans);
router.post('/', protect, borrowBook);
router.put('/:id/return', protect, returnBook);

module.exports = router;
