const { Router } = require('express');
const { getStats } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth');

const router = Router();

router.get('/', protect, getStats);

module.exports = router;
