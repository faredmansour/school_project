/**
 * Seed script — ينشئ أول مستخدم super_admin في قاعدة البيانات.
 * الاستخدام: node scripts/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { ROLES } = require('../src/config/constants');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_db');
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ role: ROLES.SUPER_ADMIN });
    if (existing) {
      console.log('⚠️  Super admin already exists:', existing.email);
      process.exit(0);
    }

    await User.create({
      name: 'مدير النظام',
      email: 'admin@rowadschool.edu.sa',
      password: 'Admin@2025#', // غيّر كلمة المرور فور تسجيل الدخول
      role: ROLES.SUPER_ADMIN,
    });

    console.log('✅ Super admin created!');
    console.log('   Email:    admin@rowadschool.edu.sa');
    console.log('   Password: Admin@2025#');
    console.log('   ⚠️  Change the password immediately after login!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
