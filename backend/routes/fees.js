const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const FEES_DIR = path.join(__dirname, '../uploads/fees');

// GET /api/fees — Public: get all fees images
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(FEES_DIR)) {
      return res.json({ success: true, data: [] });
    }
    const files = fs.readdirSync(FEES_DIR);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/uploads/fees/${file}`
      }));
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب صور الرسوم الدراسية' });
  }
});

// POST /api/fees/upload — Protected: upload fees image
router.post('/upload', protect, authorize('super_admin', 'admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'يرجى اختيار صورة لرفعها' });
  }
  res.status(201).json({
    success: true,
    message: 'تم رفع صورة الرسوم بنجاح',
    data: {
      filename: req.file.filename,
      url: `/uploads/fees/${req.file.filename}`
    }
  });
});

// DELETE /api/fees/:filename — Protected: delete fees image
router.delete('/:filename', protect, authorize('super_admin', 'admin'), (req, res) => {
  try {
    const filename = path.basename(req.params.filename); // prevent directory traversal
    const filePath = path.join(FEES_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'تم حذف الصورة بنجاح' });
    } else {
      res.status(404).json({ success: false, message: 'الصورة غير موجودة' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حذف الصورة' });
  }
});

module.exports = router;
