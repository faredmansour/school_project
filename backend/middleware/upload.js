const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folders if they don't exist
const createFolders = () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/announcements'),
    path.join(__dirname, '../uploads/fees'),
  ];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createFolders();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = path.join(__dirname, '../uploads');
    
    // Check request url to determine subfolder
    if (req.originalUrl.includes('announcements')) {
      dest = path.join(__dirname, '../uploads/announcements');
    } else if (req.originalUrl.includes('fees')) {
      dest = path.join(__dirname, '../uploads/fees');
    }
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Sanitize file name to avoid path traversal and encoding issues
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error('فقط الصور مسموح برفعها (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: fileFilter
});

module.exports = upload;
