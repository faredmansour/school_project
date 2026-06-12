const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Student Info
  studentName: {
    type: String,
    required: [true, 'اسم الطالبة مطلوب'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'تاريخ الميلاد مطلوب'],
  },
  nationality: {
    type: String,
    required: [true, 'الجنسية مطلوبة'],
    default: 'سعودية',
  },
  grade: {
    type: String,
    required: [true, 'الصف الدراسي مطلوب'],
    enum: [
      'الأول الابتدائي', 'الثاني الابتدائي', 'الثالث الابتدائي',
      'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي',
      'الأول المتوسط', 'الثاني المتوسط', 'الثالث المتوسط',
      'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي',
    ],
  },
  previousSchool: { type: String, trim: true, default: '' },

  // Guardian Info
  guardianName: {
    type: String,
    required: [true, 'اسم ولي الأمر مطلوب'],
    trim: true,
  },
  guardianRelation: {
    type: String,
    enum: ['أب', 'أم', 'أخ', 'أخت', 'جد', 'جدة', 'عم', 'خال', 'أخرى'],
    required: [true, 'صلة القرابة مطلوبة'],
  },
  guardianPhone: {
    type: String,
    required: [true, 'رقم الجوال مطلوب'],
    match: [/^05\d{8}$/, 'رقم الجوال غير صحيح (يجب أن يبدأ بـ 05)'],
  },
  guardianEmail: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صحيح'],
  },
  alternativePhone: { type: String, default: '' },

  // Registration status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'accepted', 'rejected', 'waitlist'],
    default: 'pending',
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  notes: { type: String, default: '' },
  adminNotes: { type: String, default: '', select: false },
}, { timestamps: true });

// Auto-generate registration number before save
studentSchema.pre('save', async function () {
  if (this.isNew && !this.registrationNumber) {
    const count = await mongoose.model('Student').countDocuments();
    const year = new Date().getFullYear();
    this.registrationNumber = `REG-${year}-${String(count + 1).padStart(4, '0')}`;
  }
});

studentSchema.index({ status: 1, createdAt: -1 });
studentSchema.index({ guardianEmail: 1 });

module.exports = mongoose.model('Student', studentSchema);
