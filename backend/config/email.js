const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send student registration confirmation to guardian
const sendRegistrationEmail = async (student) => {
  const transporter = createTransporter();

  const guardianHtml = `
  <!DOCTYPE html>
  <html dir="rtl" lang="ar">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;direction:rtl;">
    <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
      <div style="background:linear-gradient(135deg,#1a5276,#2980b9);padding:40px 30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">مدرسة رواد التعليمية</h1>
        <p style="color:#aed6f1;margin:8px 0 0;">تأكيد استلام طلب التسجيل</p>
      </div>
      <div style="padding:40px 30px;">
        <p style="color:#2c3e50;font-size:16px;line-height:1.8;">
          السلام عليكم ورحمة الله وبركاته،<br>
          <strong>${student.guardianName}</strong> المحترم/ة
        </p>
        <p style="color:#555;font-size:15px;line-height:1.8;">
          يسعدنا إخبارك بأنه تم استلام طلب تسجيل الطالبة 
          <strong style="color:#1a5276;">${student.studentName}</strong>
          بنجاح، وهو الآن قيد المراجعة.
        </p>
        <div style="background:#f0f7ff;border-right:4px solid #2980b9;padding:20px;border-radius:8px;margin:25px 0;">
          <h3 style="color:#1a5276;margin:0 0 15px;font-size:16px;">تفاصيل الطلب</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#555;width:45%;">رقم الطلب:</td><td style="padding:6px 0;font-weight:bold;color:#1a5276;">${student.registrationNumber}</td></tr>
            <tr><td style="padding:6px 0;color:#555;">اسم الطالبة:</td><td style="padding:6px 0;font-weight:bold;">${student.studentName}</td></tr>
            <tr><td style="padding:6px 0;color:#555;">الصف المطلوب:</td><td style="padding:6px 0;font-weight:bold;">${student.grade}</td></tr>
            <tr><td style="padding:6px 0;color:#555;">تاريخ التقديم:</td><td style="padding:6px 0;font-weight:bold;">${new Date(student.createdAt).toLocaleDateString('ar-SA')}</td></tr>
          </table>
        </div>
        <p style="color:#555;font-size:14px;line-height:1.8;">
          سيتم التواصل معك خلال 3-5 أيام عمل لإعلامك بنتيجة الطلب.
          يمكنك التواصل معنا على:
        </p>
        <div style="text-align:center;margin:25px 0;">
          <a href="tel:+966XXXXXXXXX" style="display:inline-block;background:#1a5276;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-size:15px;margin:5px;">📞 اتصل بنا</a>
          <a href="https://wa.me/966XXXXXXXXX" style="display:inline-block;background:#25d366;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-size:15px;margin:5px;">💬 واتساب</a>
        </div>
      </div>
      <div style="background:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#999;font-size:12px;margin:0;">هذه رسالة تلقائية، يرجى عدم الرد عليها مباشرة.</p>
      </div>
    </div>
  </body>
  </html>`;

  const adminHtml = `
  <div dir="rtl" style="font-family:Arial;max-width:600px;margin:auto;">
    <h2 style="color:#1a5276;">طلب تسجيل جديد 🔔</h2>
    <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%;">
      <tr><th>رقم الطلب</th><td>${student.registrationNumber}</td></tr>
      <tr><th>اسم الطالبة</th><td>${student.studentName}</td></tr>
      <tr><th>الصف</th><td>${student.grade}</td></tr>
      <tr><th>ولي الأمر</th><td>${student.guardianName} (${student.guardianRelation})</td></tr>
      <tr><th>الجوال</th><td>${student.guardianPhone}</td></tr>
      <tr><th>البريد</th><td>${student.guardianEmail}</td></tr>
      <tr><th>الجنسية</th><td>${student.nationality}</td></tr>
      <tr><th>المدرسة السابقة</th><td>${student.previousSchool || 'لم يذكر'}</td></tr>
    </table>
  </div>`;

  // Send to guardian
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: student.guardianEmail,
    subject: `تأكيد استلام طلب التسجيل - ${student.registrationNumber}`,
    html: guardianHtml,
  });

  // Notify admin
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `طلب تسجيل جديد - ${student.studentName}`,
    html: adminHtml,
  });
};

module.exports = { sendRegistrationEmail };
