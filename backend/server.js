/**
 * server.js — نقطة دخول التطبيق.
 * مسؤوليته الوحيدة: الاتصال بـ DB وبدء الاستماع على المنفذ.
 */
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

start();

module.exports = app; // لأغراض الاختبار
