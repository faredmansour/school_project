const { body } = require('express-validator');

const registerStudentValidator = [
  body('studentName').notEmpty().trim().withMessage('اسم الطالبة مطلوب'),
  body('dateOfBirth').isISO8601().withMessage('تاريخ الميلاد غير صحيح'),
  body('grade').notEmpty().withMessage('الصف الدراسي مطلوب'),
  body('guardianName').notEmpty().trim().withMessage('اسم ولي الأمر مطلوب'),
  body('guardianRelation').notEmpty().withMessage('صلة القرابة مطلوبة'),
  body('guardianPhone')
    .matches(/^05\d{8}$/)
    .withMessage('رقم الجوال غير صحيح (مثال: 0512345678)'),
  body('guardianEmail')
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
];

const updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('الحالة مطلوبة')
    .isIn(['pending', 'under_review', 'accepted', 'rejected', 'waitlist'])
    .withMessage('قيمة الحالة غير صحيحة'),
];

module.exports = { registerStudentValidator, updateStatusValidator };
