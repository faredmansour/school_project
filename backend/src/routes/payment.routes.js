const router = require('express').Router();
const { submitTransfer, processCheckout, getAll, updateStatus } = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const validate = require('../middleware/validate');
const { createPaymentValidator, checkoutValidator, updatePaymentStatusValidator } = require('../validators/payment.validator');
const { ADMIN_ROLES } = require('../config/constants');

// رفع إيصال الدفع للآباء (لا يتطلب تسجيل دخول كأدمن)
router.post(
  '/transfer',
  uploadMiddleware.single('receipt'),
  createPaymentValidator,
  validate,
  submitTransfer
);

// الدفع الإلكتروني المباشر (مدى، فيزا، آبل باي، تمارا، إلخ)
router.post(
  '/checkout',
  checkoutValidator,
  validate,
  processCheckout
);

// جلب وتعديل المدفوعات للإدارة
router.get('/', protect, authorize(...ADMIN_ROLES), getAll);
router.patch('/:id/status', protect, authorize(...ADMIN_ROLES), updatePaymentStatusValidator, validate, updateStatus);

module.exports = router;
