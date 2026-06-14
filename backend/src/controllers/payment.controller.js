const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ─── POST /api/payments/transfer ──────────────────────────────────────────
exports.submitTransfer = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.badRequest(res, 'يرجى إرفاق صورة إيصال التحويل');
  }

  const paymentData = {
    ...req.body,
    receiptUrl: `/uploads/fees/${req.file.filename}`, // Using the same upload folder for simplicity
    paymentMethod: 'bank_transfer',
  };

  const payment = await Payment.create(paymentData);

  ApiResponse.created(res, 'تم استلام إيصال التحويل بنجاح. سيتم المراجعة من قبل الإدارة.', payment);
});

// ─── POST /api/payments/checkout ──────────────────────────────────────────
exports.processCheckout = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;
  
  // Simulated Payment Gateway logic
  let status = 'approved'; // Default to approved for Mada/Visa/ApplePay/Tamara/GeelPay
  let adminNotes = 'تم الدفع إلكترونياً (بوابة تجريبية)';
  
  if (paymentMethod === 'cash') {
    status = 'pending'; // Cash requires admin to confirm receipt
    adminNotes = 'بانتظار سداد المبلغ نقداً في مقر المدرسة';
  }
  
  const paymentData = {
    ...req.body,
    status,
    adminNotes
  };

  const payment = await Payment.create(paymentData);

  let message = 'تمت عملية الدفع بنجاح!';
  if (paymentMethod === 'cash') {
    message = 'تم تسجيل طلبك. يرجى زيارة الإدارة المدرسية لتسديد المبلغ نقداً.';
  }

  ApiResponse.created(res, message, payment);
});

// ─── GET /api/payments ────────────────────────────────────────────────────
exports.getAll = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [payments, total] = await Promise.all([
    Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Payment.countDocuments(filter),
  ]);

  ApiResponse.ok(res, 'تم جلب المدفوعات', payments, {
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  });
});

// ─── PATCH /api/payments/:id/status ───────────────────────────────────────
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status, ...(notes !== undefined && { adminNotes: notes }) },
    { new: true }
  );

  if (!payment) return ApiResponse.notFound(res, 'عملية الدفع غير موجودة');

  ApiResponse.ok(res, 'تم تحديث حالة الدفع', payment);
});
