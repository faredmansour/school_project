const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── إنشاء مجلدات الرفع إذا لم تكن موجودة ─────────────────────────────
const UPLOAD_BASE = path.join(__dirname, '../../uploads');
const UPLOAD_DIRS = {
  announcements: path.join(UPLOAD_BASE, 'announcements'),
  fees: path.join(UPLOAD_BASE, 'fees'),
};

Object.values(UPLOAD_DIRS).forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Storage ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = UPLOAD_BASE;
    if (req.originalUrl.includes('announcements')) dest = UPLOAD_DIRS.announcements;
    else if (req.originalUrl.includes('fees')) dest = UPLOAD_DIRS.fees;
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ─── File Filter ──────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase())) {
    return cb(null, true);
  }
  cb(new Error('فقط الصور مسموح برفعها (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

module.exports = upload;
