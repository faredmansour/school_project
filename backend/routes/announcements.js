const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const fs = require('fs');
const path = require('path');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/announcements — Public: active announcements
router.get('/', [
  query('type').optional().isIn(['announcement', 'offer', 'news', 'event']),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('page').optional().isInt({ min: 1 }),
], async (req, res) => {
  try {
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

    res.json({
      success: true,
      data: announcements,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الإعلانات' });
  }
});

// GET /api/announcements/admin — Protected: all announcements for admin
router.get('/admin', protect, authorize('super_admin', 'admin', 'editor'), async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الإعلانات' });
  }
});

// POST /api/announcements — Protected: create announcement with image upload
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), upload.single('image'), [
  body('title').notEmpty().trim().withMessage('العنوان مطلوب').isLength({ max: 200 }),
  body('content').notEmpty().trim().withMessage('المحتوى مطلوب'),
  body('type').optional().isIn(['announcement', 'offer', 'news', 'event']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const announcementData = {
      ...req.body,
      createdBy: req.user._id,
      isActive: req.body.isActive === 'false' ? false : true,
      isPinned: req.body.isPinned === 'true' ? true : false,
    };

    if (req.file) {
      announcementData.image = `/uploads/announcements/${req.file.filename}`;
    }

    const announcement = await Announcement.create(announcementData);
    res.status(201).json({ success: true, data: announcement, message: 'تم إنشاء الإعلان بنجاح' });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'خطأ في إنشاء الإعلان' });
  }
});

// PUT /api/announcements/:id — Protected: edit announcement with image upload
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), upload.single('image'), async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'الإعلان غير موجود' });
    }

    const updateData = {
      ...req.body,
      isActive: req.body.isActive === 'false' ? false : (req.body.isActive === 'true' ? true : announcement.isActive),
      isPinned: req.body.isPinned === 'false' ? false : (req.body.isPinned === 'true' ? true : announcement.isPinned),
    };
    
    if (req.file) {
      if (announcement.image) {
        const oldPath = path.join(__dirname, '..', announcement.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.image = `/uploads/announcements/${req.file.filename}`;
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: announcement, message: 'تم تحديث الإعلان' });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'خطأ في تحديث الإعلان' });
  }
});

// DELETE /api/announcements/:id — Protected: delete announcement and delete its image file from disk
router.delete('/:id', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: 'الإعلان غير موجود' });

    if (announcement.image) {
      const imgPath = path.join(__dirname, '..', announcement.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الإعلان' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حذف الإعلان' });
  }
});

module.exports = router;
