const router = require('express').Router();
const { getAll, create, remove, sync } = require('../controllers/social.controller');
const { protect, authorize } = require('../middleware/auth');
const { ADMIN_ROLES, EDITOR_ROLES } = require('../config/constants');

router.get('/',       getAll);
router.post('/',      protect, authorize(...EDITOR_ROLES), create);
router.delete('/:id', protect, authorize(...ADMIN_ROLES), remove);
router.post('/sync',  protect, authorize(...EDITOR_ROLES), sync);

module.exports = router;
