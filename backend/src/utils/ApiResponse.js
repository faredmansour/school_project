/**
 * ApiResponse — توحيد شكل الـ API responses في كل التطبيق.
 * يضمن أن كل الـ responses لها نفس البنية.
 */
class ApiResponse {
  /**
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {boolean} success
   * @param {string} message
   * @param {*} [data]
   * @param {*} [meta] - معلومات إضافية مثل pagination
   */
  static send(res, statusCode, success, message, data = null, meta = null) {
    const body = { success, message };
    if (data !== null) body.data = data;
    if (meta !== null) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  static ok(res, message, data = null, meta = null) {
    return this.send(res, 200, true, message, data, meta);
  }

  static created(res, message, data = null) {
    return this.send(res, 201, true, message, data);
  }

  static badRequest(res, message, errors = null) {
    const body = { success: false, message };
    if (errors) body.errors = errors;
    return res.status(400).json(body);
  }

  static unauthorized(res, message = 'غير مصرح، يرجى تسجيل الدخول') {
    return this.send(res, 401, false, message);
  }

  static forbidden(res, message = 'ليس لديك صلاحية للقيام بهذا الإجراء') {
    return this.send(res, 403, false, message);
  }

  static notFound(res, message = 'المورد غير موجود') {
    return this.send(res, 404, false, message);
  }

  static serverError(res, message = 'حدث خطأ في الخادم') {
    return this.send(res, 500, false, message);
  }
}

module.exports = ApiResponse;
