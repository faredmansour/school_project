/**
 * constants.js — ثوابت مركزية للتطبيق.
 * استخدامها في Models, Validators, Controllers يضمن consistency.
 */

const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
});

/** جميع الأدوار كـ array — مفيد لـ authorize() middleware */
const ALL_ROLES = Object.values(ROLES);

/** الأدوار التي تملك صلاحيات الحذف والتعديل الحساس */
const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN];

/** الأدوار التي تملك صلاحيات القراءة والإضافة */
const EDITOR_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR];

// ─── الصفوف الدراسية ───────────────────────────────────────────────────────
const GRADES = Object.freeze([
  'الأول الابتدائي',
  'الثاني الابتدائي',
  'الثالث الابتدائي',
  'الرابع الابتدائي',
  'الخامس الابتدائي',
  'السادس الابتدائي',
  'الأول المتوسط',
  'الثاني المتوسط',
  'الثالث المتوسط',
  'الأول الثانوي',
  'الثاني الثانوي',
  'الثالث الثانوي',
]);

// ─── حالات طلب التسجيل ────────────────────────────────────────────────────
const STUDENT_STATUSES = Object.freeze({
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WAITLIST: 'waitlist',
});

// ─── صلات القرابة ─────────────────────────────────────────────────────────
const GUARDIAN_RELATIONS = Object.freeze([
  'أب', 'أم', 'أخ', 'أخت', 'جد', 'جدة', 'عم', 'خال', 'أخرى',
]);

// ─── أنواع الإعلانات ───────────────────────────────────────────────────────
const ANNOUNCEMENT_TYPES = Object.freeze([
  'announcement', 'offer', 'news', 'event',
]);

// ─── منصات السوشيال ────────────────────────────────────────────────────────
const SOCIAL_PLATFORMS = Object.freeze([
  'instagram', 'twitter', 'facebook', 'tiktok',
]);

// ─── مفاتيح الإعدادات العامة ───────────────────────────────────────────────
const PUBLIC_SETTINGS_KEYS = Object.freeze([
  'school_name',
  'school_phone',
  'school_email',
  'social_links',
  'payment_methods',
  'hero_text',
]);

module.exports = {
  ROLES,
  ALL_ROLES,
  ADMIN_ROLES,
  EDITOR_ROLES,
  GRADES,
  STUDENT_STATUSES,
  GUARDIAN_RELATIONS,
  ANNOUNCEMENT_TYPES,
  SOCIAL_PLATFORMS,
  PUBLIC_SETTINGS_KEYS,
};
