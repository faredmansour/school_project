const router = require('express').Router();
const { getPublic, update } = require('../controllers/settings.controller');
const { protect, authorize } = require('../middleware/auth');
const { ADMIN_ROLES } = require('../config/constants');

router.get('/public',   getPublic);
router.put('/:key',     protect, authorize(...ADMIN_ROLES), update);

module.exports = router;
