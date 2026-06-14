const mongoose = require('mongoose');

/**
 * Settings — نموذج مستقل لإعدادات الموقع (key-value store).
 * استبدل التعريف الـ inline في routes/settings.js و routes/socialFeed.js.
 */
const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: [true, 'مفتاح الإعداد مطلوب'],
    trim: true,
    index: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
