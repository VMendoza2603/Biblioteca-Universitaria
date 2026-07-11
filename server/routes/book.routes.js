const { Router } = require('express');
const { getAll, getById, create, update, remove } = require('../controllers/book.controller');
const { createBookValidator, updateBookValidator } = require('../validators/book.validators');
const validate = require('../middlewares/validate');
const { protect, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/', protect, getAll);
router.get('/:id', protect, getById);
router.post('/', protect, authorize('admin'), createBookValidator, validate, create);
router.put('/:id', protect, authorize('admin'), updateBookValidator, validate, update);
router.delete('/:id', protect, authorize('admin'), remove);

module.exports = router;
