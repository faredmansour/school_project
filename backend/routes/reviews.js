const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');

// GET /api/reviews — Public: get approved reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب التقييمات' });
  }
});

// POST /api/reviews — Public: submit new review for moderation
router.post('/', [
  body('name').notEmpty().trim().withMessage('اسمك مطلوب'),
  body('comment').notEmpty().trim().withMessage('التعليق مطلوب'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('التقييم يجب أن يكون بين 1 و 5 نجوم'),
  body('role').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const review = await Review.create({
      name: req.body.name,
      comment: req.body.comment,
      rating: req.body.rating,
      role: req.body.role || 'زائر',
      isApproved: false, // Must be approved by admin
    });

    res.status(201).json({
      success: true,
      message: 'شكراً لتقييمك! سيظهر تعليقك في الموقع بعد مراجعته من الإدارة.',
      data: review
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حفظ التقييم' });
  }
});

// GET /api/reviews/admin — Protected Admin: get all reviews for moderation
router.get('/admin', protect, authorize('super_admin', 'admin', 'editor'), async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب التقييمات للمشرف' });
  }
});

// PATCH /api/reviews/:id/approve — Protected Admin: approve a review
router.patch('/:id/approve', protect, authorize('super_admin', 'admin', 'editor'), async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'التقييم غير موجود' });
    res.json({ success: true, data: review, message: 'تمت الموافقة على التقييم بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في تعديل التقييم' });
  }
});

// DELETE /api/reviews/:id — Protected Admin: delete a review
router.delete('/:id', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'التقييم غير موجود' });
    res.json({ success: true, message: 'تم حذف التقييم بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حذف التقييم' });
  }
});

module.exports = router;
