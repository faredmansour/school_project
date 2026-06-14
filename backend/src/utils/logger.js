/**
 * logger.js — Morgan HTTP request logger.
 * - Development: ألوان + تفاصيل كل طلب
 * - Production: بيانات مختصرة (combined format)
 * يتحمل الغياب المؤقت لـ morgan أثناء التثبيت.
 */
let logger;
try {
  const morgan = require('morgan');
  logger = morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev');
} catch {
  // morgan لم تُنصَّب بعد — fallback بسيط
  logger = (req, _res, next) => {
    console.log(`📡 ${req.method} ${req.url}`);
    next();
  };
}

module.exports = logger;
