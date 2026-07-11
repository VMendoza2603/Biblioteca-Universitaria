const { Router } = require('express');
const { register, login, getProfile } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validators');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/profile', protect, getProfile);

module.exports = router;
