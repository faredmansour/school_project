const { body } = require('express-validator');

const createPaymentValidator = [
  body('registrationNumber').notEmpty().trim().withMessage('رقم طلب التسجيل مطلوب'),
  body('studentName').notEmpty().trim().withMessage('اسم الطالب مطلوب'),
  body('amount').isNumeric().withMessage('المبلغ يجب أن يكون رقماً').custom(value => value > 0).withMessage('المبلغ يجب أن يكون أكبر من الصفر'),
];

const checkoutValidator = [
  ...createPaymentValidator,
  body('paymentMethod').isIn(['mada', 'visa', 'apple_pay', 'tamara', 'geel_pay', 'cash']).withMessage('وسيلة دفع غير صالحة'),
];

const updatePaymentStatusValidator = [
  body('status')
    .notEmpty().withMessage('الحالة مطلوبة')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('حالة غير صالحة'),
];

module.exports = { createPaymentValidator, checkoutValidator, updatePaymentStatusValidator };
