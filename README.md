# مدرسة رواد التعليمية — Full-Stack Website

## 📋 تقسيم المشروع

### ✅ Phase 1 — الأساس (منجز)
**Frontend:**
- `index.html` — Landing Page كاملة (Hero, About, Announcements, Payment, Social, Footer)
- `register.html` — صفحة تسجيل الطلاب متعددة الخطوات مع validation

**Backend (Express + MongoDB):**
- `server.js` — Express app مع Helmet, Rate Limiting, CORS
- `models/User.js` — نموذج المستخدمين (RBAC: super_admin / admin / editor)
- `models/Announcement.js` — نموذج الإعلانات
- `models/Student.js` — نموذج تسجيل الطالبات (auto registration number)
- `routes/auth.js` — تسجيل دخول + JWT Access/Refresh tokens
- `routes/announcements.js` — CRUD للإعلانات (public GET + protected POST/PUT/DELETE)
- `routes/students.js` — تسجيل الطالبات + إرسال email تلقائي
- `routes/settings.js` — إعدادات الموقع key-value
- `config/email.js` — قوالب email HTML احترافية للتأكيد

---

### 🔜 Phase 2 — الصفحات الخاصة
**Frontend:**
- `fees.html` — صفحة الرسوم (noindex/nofollow, رابط مباشر فقط)
- `links.html` — صفحة Linktree مخصصة بتصميم هوية المدرسة
- ربط Social Media API (Instagram Basic Display API)

**Backend:**
- `routes/fees.js` — API لرفع/تحديث صور الرسوم
- `routes/socialFeed.js` — جلب وتخزين منشورات السوشيال ميديا (cron job)
- `models/SocialPost.js` — تخزين المنشورات للعرض
- `middleware/upload.js` — Multer لرفع الصور

---

### 🔜 Phase 3 — Admin Dashboard
**Frontend:**
- `admin/index.html` — لوحة التحكم الرئيسية
- `admin/announcements.html` — إدارة الإعلانات
- `admin/students.html` — قائمة الطلاب + تغيير الحالة
- `admin/fees.html` — رفع صور الرسوم
- `admin/settings.html` — إعدادات الموقع

**Backend:**
- `routes/reviews.js` — تقييمات الزوار (CRUD)
- `models/Review.js` — نموذج التقييمات
- Docker + nginx config
- CI/CD pipeline (GitHub Actions)

---

## 🚀 تشغيل المشروع

### Backend
```bash
cd backend
cp .env.example .env
# عدّل .env بإعداداتك (MongoDB URI, Email credentials)
npm install
node scripts/seed.js   # إنشاء أول admin
npm run dev            # أو npm start
```

### Frontend
```bash
# للتطوير: استخدم Live Server أو
cd frontend
npx serve .
```

### API Endpoints

| Method | Route | Auth | الوظيفة |
|--------|-------|------|---------|
| POST | `/api/auth/login` | ❌ | تسجيل الدخول |
| POST | `/api/auth/refresh` | ❌ | تجديد token |
| POST | `/api/auth/logout` | ✅ | تسجيل الخروج |
| GET  | `/api/auth/me` | ✅ | بيانات المستخدم |
| GET  | `/api/announcements` | ❌ | جلب الإعلانات النشطة |
| GET  | `/api/announcements/admin` | ✅ | كل الإعلانات |
| POST | `/api/announcements` | ✅ | إنشاء إعلان |
| PUT  | `/api/announcements/:id` | ✅ | تعديل إعلان |
| DELETE | `/api/announcements/:id` | ✅ Admin | حذف إعلان |
| POST | `/api/students/register` | ❌ | تسجيل طالبة |
| GET  | `/api/students` | ✅ Admin | قائمة الطلاب |
| PATCH | `/api/students/:id/status` | ✅ Admin | تغيير حالة الطلب |
| GET  | `/api/settings/public` | ❌ | إعدادات عامة |
| PUT  | `/api/settings/:key` | ✅ Admin | تعديل إعداد |

---

## 🔐 Security Features
- JWT Access Token (15min) + Refresh Token (7 days) rotation
- RBAC: super_admin / admin / editor
- Helmet.js headers
- Rate limiting: 100 req/15min per IP
- bcrypt password hashing (salt rounds: 12)
- Input validation via express-validator

---

## 📁 Project Structure
```
school-project/
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── models/        (User, Announcement, Student)
│   ├── routes/        (auth, announcements, students, settings)
│   ├── middleware/    (auth.js)
│   ├── config/        (email.js)
│   └── scripts/       (seed.js)
└── frontend/
    ├── index.html     ← Landing Page
    └── register.html  ← Student Registration Form
```
