const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { PUBLIC_SETTINGS_KEYS } = require('../config/constants');

// ─── GET /api/settings/public ─────────────────────────────────────────────
exports.getPublic = asyncHandler(async (req, res) => {
  const settings = await Settings.find({ key: { $in: PUBLIC_SETTINGS_KEYS } });
  const result = {};
  settings.forEach((s) => { result[s.key] = s.value; });
  ApiResponse.ok(res, 'تم جلب الإعدادات', result);
});

// ─── PUT /api/settings/:key ───────────────────────────────────────────────
exports.update = asyncHandler(async (req, res) => {
  const { value } = req.body;
  const setting = await Settings.findOneAndUpdate(
    { key: req.params.key },
    { value, updatedBy: req.user._id },
    { upsert: true, new: true }
  );
  ApiResponse.ok(res, 'تم حفظ الإعداد', setting);
});
