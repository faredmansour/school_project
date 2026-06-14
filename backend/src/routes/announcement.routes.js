const router = require('express').Router();
const {
  getPublic, getAdmin, create, update, remove,
} = require('../controllers/announcement.controller');
const { protect, authorize } = require('../middleware/auth');
const { getAnnouncementsValidator, createAnnouncementValidator } = require('../validators/announcement.validator');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { ADMIN_ROLES, EDITOR_ROLES } = require('../config/constants');

router.get('/',           getAnnouncementsValidator, validate, getPublic);
router.get('/admin',      protect, authorize(...EDITOR_ROLES), getAdmin);
router.post('/',          protect, authorize(...EDITOR_ROLES), upload.single('image'), createAnnouncementValidator, validate, create);
router.put('/:id',        protect, authorize(...EDITOR_ROLES), upload.single('image'), update);
router.delete('/:id',     protect, authorize(...ADMIN_ROLES), remove);

module.exports = router;
