const { body } = require('express-validator');

const loginValidator = [
  body('email')
    .isEmail().withMessage('بريد إلكتروني غير صحيح')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('كلمة المرور مطلوبة'),
];

module.exports = { loginValidator };
