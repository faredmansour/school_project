const fs = require('fs');
const path = require('path');
const Announcement = require('../models/Announcement');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ─── GET /api/announcements ──────────────────────────────────────────────
exports.getPublic = asyncHandler(async (req, res) => {
  const { type, limit = 10, page = 1 } = req.query;
  const filter = {
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  };
  if (type) filter.type = type;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [announcements, total] = await Promise.all([
    Announcement.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-createdBy'),
    Announcement.countDocuments(filter),
  ]);

  ApiResponse.ok(res, 'تم جلب الإعلانات', announcements, {
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  });
});

// ─── GET /api/announcements/admin ────────────────────────────────────────
exports.getAdmin = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email');
  ApiResponse.ok(res, 'تم جلب الإعلانات', announcements);
});

// ─── POST /api/announcements ─────────────────────────────────────────────
exports.create = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
    createdBy: req.user._id,
    isActive: req.body.isActive !== 'false',
    isPinned: req.body.isPinned === 'true',
  };
  if (req.file) {
    data.image = `/uploads/announcements/${req.file.filename}`;
  }

  const announcement = await Announcement.create(data);
  ApiResponse.created(res, 'تم إنشاء الإعلان بنجاح', announcement);
});

// ─── PUT /api/announcements/:id ──────────────────────────────────────────
exports.update = asyncHandler(async (req, res) => {
  let announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    if (req.file) fs.unlinkSync(req.file.path);
    return ApiResponse.notFound(res, 'الإعلان غير موجود');
  }

  const updateData = {
    ...req.body,
    isActive: req.body.isActive === 'false' ? false
      : req.body.isActive === 'true' ? true
      : announcement.isActive,
    isPinned: req.body.isPinned === 'false' ? false
      : req.body.isPinned === 'true' ? true
      : announcement.isPinned,
  };

  if (req.file) {
    // حذف الصورة القديمة
    if (announcement.image) {
      const oldPath = path.join(__dirname, '../../', announcement.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    updateData.image = `/uploads/announcements/${req.file.filename}`;
  }

  announcement = await Announcement.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  ApiResponse.ok(res, 'تم تحديث الإعلان', announcement);
});

// ─── DELETE /api/announcements/:id ───────────────────────────────────────
exports.remove = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) return ApiResponse.notFound(res, 'الإعلان غير موجود');

  if (announcement.image) {
    const imgPath = path.join(__dirname, '../../', announcement.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  await Announcement.findByIdAndDelete(req.params.id);
  ApiResponse.ok(res, 'تم حذف الإعلان');
});
