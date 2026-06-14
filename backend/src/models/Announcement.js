const mongoose = require('mongoose');
const { ANNOUNCEMENT_TYPES } = require('../config/constants');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان الإعلان مطلوب'],
    trim: true,
    maxlength: [200, 'العنوان طويل جداً'],
  },
  content: {
    type: String,
    required: [true, 'محتوى الإعلان مطلوب'],
    trim: true,
  },
  type: {
    type: String,
    enum: ANNOUNCEMENT_TYPES,
    default: 'announcement',
  },
  image: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
  expiresAt: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Index for active + sorted queries
announcementSchema.index({ isActive: 1, isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
