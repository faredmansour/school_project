/**
 * errorHandler — middleware مركزي لمعالجة الأخطاء.
 * يُسجَّل في آخر middleware في app.js.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`❌ [${req.method}] ${req.originalUrl} — ${err.message}`);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `القيمة المدخلة لحقل (${field}) مستخدمة مسبقاً`,
    });
  }

  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  // JWT errors (backup — shouldn't reach here normally)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'رمز غير صالح' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'انتهت صلاحية الجلسة', expired: true });
  }

  // Default error
  const statusCode = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' ? 'حدث خطأ في الخادم' : err.message;

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
