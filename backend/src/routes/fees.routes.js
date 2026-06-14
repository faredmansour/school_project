const router = require('express').Router();
const { getAll, upload, remove } = require('../controllers/fees.controller');
const { protect, authorize } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const { ADMIN_ROLES } = require('../config/constants');

router.get('/',                  getAll);
router.post('/upload',           protect, authorize(...ADMIN_ROLES), uploadMiddleware.single('image'), upload);
router.delete('/:filename',      protect, authorize(...ADMIN_ROLES), remove);

module.exports = router;
