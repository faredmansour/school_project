const router = require('express').Router();
const { register, getAll, updateStatus } = require('../controllers/student.controller');
const { protect, authorize } = require('../middleware/auth');
const { registerStudentValidator, updateStatusValidator } = require('../validators/student.validator');
const validate = require('../middleware/validate');
const { ADMIN_ROLES } = require('../config/constants');

router.post('/register',         registerStudentValidator, validate, register);
router.get('/',                  protect, authorize(...ADMIN_ROLES), getAll);
router.patch('/:id/status',      protect, authorize(...ADMIN_ROLES), updateStatusValidator, validate, updateStatus);

module.exports = router;
