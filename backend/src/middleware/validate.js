const { validationResult } = require('express-validator');

/**
 * validate — middleware يتحقق من نتائج express-validator
 * ويرسل رد 400 تلقائياً إذا كان هناك أخطاء.
 *
 * الاستخدام:
 *   router.post('/route', [...validationRules], validate, controllerFn);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
