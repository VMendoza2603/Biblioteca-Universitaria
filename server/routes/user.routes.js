const { Router } = require('express');
const { getUsers } = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;
