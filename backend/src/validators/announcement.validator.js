const { body, query } = require('express-validator');
const { ANNOUNCEMENT_TYPES } = require('../config/constants');

const getAnnouncementsValidator = [
  query('type').optional().isIn(ANNOUNCEMENT_TYPES).withMessage('نوع الإعلان غير صحيح'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('الحد يجب أن يكون بين 1 و 50'),
  query('page').optional().isInt({ min: 1 }).withMessage('رقم الصفحة غير صحيح'),
];

const createAnnouncementValidator = [
  body('title')
    .notEmpty().trim().withMessage('العنوان مطلوب')
    .isLength({ max: 200 }).withMessage('العنوان يجب ألا يتجاوز 200 حرف'),
  body('content').notEmpty().trim().withMessage('المحتوى مطلوب'),
  body('type').optional().isIn(ANNOUNCEMENT_TYPES).withMessage('نوع الإعلان غير صحيح'),
];

module.exports = { getAnnouncementsValidator, createAnnouncementValidator };
