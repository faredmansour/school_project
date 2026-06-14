const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ─── GET /api/reviews ─────────────────────────────────────────────────────
exports.getApproved = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
  ApiResponse.ok(res, 'تم جلب التقييمات', reviews);
});

// ─── POST /api/reviews ────────────────────────────────────────────────────
exports.create = asyncHandler(async (req, res) => {
  const review = await Review.create({
    name: req.body.name,
    comment: req.body.comment,
    rating: req.body.rating,
    role: req.body.role || 'زائر',
    isApproved: false,
  });
  ApiResponse.created(
    res,
    'شكراً لتقييمك! سيظهر تعليقك في الموقع بعد مراجعته من الإدارة.',
    review
  );
});

// ─── GET /api/reviews/admin ──────────────────────────────────────────────
exports.getAll = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  ApiResponse.ok(res, 'تم جلب التقييمات', reviews);
});

// ─── PATCH /api/reviews/:id/approve ─────────────────────────────────────
exports.approve = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  if (!review) return ApiResponse.notFound(res, 'التقييم غير موجود');
  ApiResponse.ok(res, 'تمت الموافقة على التقييم بنجاح', review);
});

// ─── DELETE /api/reviews/:id ─────────────────────────────────────────────
exports.remove = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return ApiResponse.notFound(res, 'التقييم غير موجود');
  ApiResponse.ok(res, 'تم حذف التقييم بنجاح');
});
