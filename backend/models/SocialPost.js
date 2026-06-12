const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'رابط المنشور مطلوب'],
    trim: true,
  },
  mediaUrl: {
    type: String,
    default: null,
  },
  caption: {
    type: String,
    default: '',
    trim: true,
  },
  platform: {
    type: String,
    enum: ['instagram', 'twitter', 'other'],
    default: 'instagram',
  },
  postId: {
    type: String,
    sparse: true,
    unique: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

socialPostSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('SocialPost', socialPostSchema);
