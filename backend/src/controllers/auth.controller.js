const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ─── Helper ────────────────────────────────────────────────────────────────
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
  return { accessToken, refreshToken };
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password +refreshToken');

  if (!user || !(await user.comparePassword(password))) {
    return ApiResponse.unauthorized(res, 'بيانات الدخول غير صحيحة');
  }
  if (!user.isActive) {
    return ApiResponse.forbidden(res, 'الحساب موقوف');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  ApiResponse.ok(res, 'تم تسجيل الدخول بنجاح', {
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ─── POST /api/auth/refresh ────────────────────────────────────────────────
exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return ApiResponse.unauthorized(res, 'رمز التحديث مطلوب');
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    return ApiResponse.unauthorized(res, 'رمز غير صالح');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
  user.refreshToken = newRefreshToken;
  await user.save();

  ApiResponse.ok(res, 'تم تجديد الجلسة', { accessToken, refreshToken: newRefreshToken });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────
exports.logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  ApiResponse.ok(res, 'تم تسجيل الخروج');
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────
exports.getMe = (req, res) => {
  ApiResponse.ok(res, 'بيانات المستخدم', req.user);
};
