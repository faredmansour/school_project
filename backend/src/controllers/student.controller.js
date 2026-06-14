const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { sendRegistrationEmail } = require('../config/email');

// ─── POST /api/students/register ─────────────────────────────────────────
exports.register = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);

  // إرسال بريد تأكيد (non-blocking — لا يُوقف الاستجابة)
  sendRegistrationEmail(student).catch((err) =>
    console.error('Email send failed:', err.message)
  );

  ApiResponse.created(res, 'تم استلام طلب التسجيل بنجاح! سيتم التواصل معك قريباً.', {
    registrationNumber: student.registrationNumber,
  });
});

// ─── GET /api/students ────────────────────────────────────────────────────
exports.getAll = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [students, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Student.countDocuments(filter),
  ]);

  ApiResponse.ok(res, 'تم جلب الطلاب', students, {
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  });
});

// ─── PATCH /api/students/:id/status ──────────────────────────────────────
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { status, ...(notes && { adminNotes: notes }) },
    { new: true }
  );
  if (!student) return ApiResponse.notFound(res, 'الطالبة غير موجودة');
  ApiResponse.ok(res, 'تم تحديث حالة الطلب', student);
});
