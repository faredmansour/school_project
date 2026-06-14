const router = require('express').Router();
const { getApproved, create, getAll, approve, remove } = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth');
const { createReviewValidator } = require('../validators/review.validator');
const validate = require('../middleware/validate');
const { ADMIN_ROLES, EDITOR_ROLES } = require('../config/constants');

router.get('/',              getApproved);
router.post('/',             createReviewValidator, validate, create);
router.get('/admin',         protect, authorize(...EDITOR_ROLES), getAll);
router.patch('/:id/approve', protect, authorize(...EDITOR_ROLES), approve);
router.delete('/:id',        protect, authorize(...ADMIN_ROLES), remove);

module.exports = router;
