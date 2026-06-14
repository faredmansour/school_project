const mongoose = require('mongoose');

/**
 * connectDB — ينشئ الاتصال بـ MongoDB.
 * يُستدعى مرة واحدة عند بدء تشغيل الخادم.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
