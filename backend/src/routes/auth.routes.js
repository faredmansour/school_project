const router = require('express').Router();
const { login, refresh, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate');

router.post('/login',   loginValidator, validate, login);
router.post('/refresh', refresh);
router.post('/logout',  protect, logout);
router.get('/me',       protect, getMe);

module.exports = router;
