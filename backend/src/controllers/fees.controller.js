const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const FEES_DIR = path.join(__dirname, '../../uploads/fees');

// ─── GET /api/fees ────────────────────────────────────────────────────────
exports.getAll = asyncHandler(async (req, res) => {
  if (!fs.existsSync(FEES_DIR)) {
    return ApiResponse.ok(res, 'لا توجد صور', []);
  }
  const files = fs.readdirSync(FEES_DIR);
  const images = files
    .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map((file) => ({ filename: file, url: `/uploads/fees/${file}` }));
  ApiResponse.ok(res, 'تم جلب صور الرسوم', images);
});

// ─── POST /api/fees/upload ────────────────────────────────────────────────
exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.badRequest(res, 'يرجى اختيار صورة لرفعها');
  }
  ApiResponse.created(res, 'تم رفع صورة الرسوم بنجاح', {
    filename: req.file.filename,
    url: `/uploads/fees/${req.file.filename}`,
  });
});

// ─── DELETE /api/fees/:filename ───────────────────────────────────────────
exports.remove = asyncHandler(async (req, res) => {
  const filename = path.basename(req.params.filename); // منع path traversal
  const filePath = path.join(FEES_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return ApiResponse.notFound(res, 'الصورة غير موجودة');
  }

  fs.unlinkSync(filePath);
  ApiResponse.ok(res, 'تم حذف الصورة بنجاح');
});
