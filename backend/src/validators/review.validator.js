const { body } = require('express-validator');

const createReviewValidator = [
  body('name').notEmpty().trim().withMessage('اسمك مطلوب'),
  body('comment').notEmpty().trim().withMessage('التعليق مطلوب'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('التقييم يجب أن يكون بين 1 و 5 نجوم'),
  body('role').optional().trim(),
];

module.exports = { createReviewValidator };
