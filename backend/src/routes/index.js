/**
 * routes/index.js — نقطة مركزية لتسجيل جميع API routes.
 * app.js يستورد هذا الملف فقط بدلاً من تسجيل كل route بشكل منفصل.
 */
const router = require('express').Router();

router.use('/auth',          require('./auth.routes'));
router.use('/announcements', require('./announcement.routes'));
router.use('/students',      require('./student.routes'));
router.use('/settings',      require('./settings.routes'));
router.use('/reviews',       require('./review.routes'));
router.use('/fees',          require('./fees.routes'));
router.use('/social',        require('./social.routes'));
router.use('/payments',      require('./payment.routes'));

// Health check
router.get('/health', (req, res) =>
  res.json({ success: true, message: 'Server is running', timestamp: new Date() })
);

module.exports = router;
