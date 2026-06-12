const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');
const { sendRegistrationEmail } = require('../config/email');

const registrationValidation = [
  body('studentName').notEmpty().trim().withMessage('اسم الطالبة مطلوب'),
  body('dateOfBirth').isISO8601().withMessage('تاريخ الميلاد غير صحيح'),
  body('grade').notEmpty().withMessage('الصف الدراسي مطلوب'),
  body('guardianName').notEmpty().trim().withMessage('اسم ولي الأمر مطلوب'),
  body('guardianRelation').notEmpty().withMessage('صلة القرابة مطلوبة'),
  body('guardianPhone')
    .matches(/^05\d{8}$/)
    .withMessage('رقم الجوال غير صحيح (مثال: 0512345678)'),
  body('guardianEmail').isEmail().withMessage('البريد الإلكتروني غير صحيح').normalizeEmail(),
];

// POST /api/students/register — Public
router.post('/register', registrationValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const student = await Student.create(req.body);

    // Send emails (non-blocking: don't fail if email fails)
    sendRegistrationEmail(student).catch(err =>
      console.error('Email send failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'تم استلام طلب التسجيل بنجاح! سيتم التواصل معك قريباً.',
      registrationNumber: student.registrationNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في إرسال الطلب، يرجى المحاولة لاحقاً' });
  }
});

// GET /api/students — Protected Admin
router.get('/', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [students, total] = await Promise.all([
      Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Student.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب البيانات' });
  }
});

// PATCH /api/students/:id/status — Protected Admin
router.patch('/:id/status', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes && { adminNotes: notes }) },
      { new: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'الطالبة غير موجودة' });
    res.json({ success: true, data: student, message: 'تم تحديث حالة الطلب' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في التحديث' });
  }
});

module.exports = router;
