const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المعلق مطلوب'],
    trim: true,
  },
  role: {
    type: String,
    default: 'زائر',
    trim: true,
  },
  comment: {
    type: String,
    required: [true, 'التعليق مطلوب'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'التقييم بالنجوم مطلوب'],
    min: [1, 'الحد الأدنى للتقييم هو 1'],
    max: [5, 'الحد الأقصى للتقييم هو 5'],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

reviewSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
