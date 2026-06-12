/**
 * Seed script — creates the first super_admin user
 * Usage: node scripts/seed.js
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_db');
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ role: 'super_admin' });
    if (existing) {
      console.log('⚠️  Super admin already exists:', existing.email);
      process.exit(0);
    }

    await User.create({
      name: 'مدير النظام',
      email: 'admin@rowadschool.edu.sa',
      password: 'Admin@2025#', // Change immediately after first login
      role: 'super_admin',
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
