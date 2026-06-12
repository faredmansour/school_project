const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, authorize } = require('../middleware/auth');

// Simple key-value settings schema
const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

// GET /api/settings/public — public site settings
router.get('/public', async (req, res) => {
  try {
    const settings = await Settings.find({
      key: { $in: ['school_name', 'school_phone', 'school_email', 'social_links', 'payment_methods', 'hero_text'] }
    });
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الإعدادات' });
  }
});

// PUT /api/settings/:key — Protected
router.put('/:key', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value, updatedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: setting, message: 'تم حفظ الإعداد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حفظ الإعداد' });
  }
});

module.exports = router;
