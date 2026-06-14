/**
 * asyncHandler — يلف الـ async route handlers لتجنب try/catch المتكرر.
 * أي خطأ يُرسَل تلقائياً لـ errorHandler middleware عبر next(err).
 *
 * @param {Function} fn - async route handler
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
