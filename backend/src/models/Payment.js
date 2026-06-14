const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'رقم طلب التسجيل مطلوب'],
    trim: true,
  },
  studentName: {
    type: String,
    required: [true, 'اسم الطالب مطلوب'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'المبلغ المدفوع مطلوب'],
    min: [1, 'المبلغ يجب أن يكون أكبر من الصفر'],
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'mada', 'visa', 'apple_pay', 'tamara', 'geel_pay', 'cash'],
    default: 'bank_transfer',
  },
  receiptUrl: {
    type: String,
    // Required only for bank_transfer
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
