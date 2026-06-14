# مدرسة رواد التعليمية — Full-Stack Website

موقع مدرسة رواد التعليمية — مبني بـ **Express.js + MongoDB** للـ Backend وـ **HTML/CSS/JS** للـ Frontend.

---

## 📁 هيكل المشروع

```
school_project/
│
├── docker-compose.yml          # للنشر والتطوير بـ Docker
│
├── backend/
│   ├── server.js               # نقطة الدخول: DB connect + listen
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   ├── scripts/
│   │   └── seed.js             # إنشاء أول admin
│   └── src/
│       ├── app.js              # إعداد Express (middleware + routes)
│       ├── config/
│       │   ├── constants.js    # ROLES, GRADES, STATUSES...
│       │   ├── db.js           # اتصال MongoDB
│       │   └── email.js        # قوالب البريد الإلكتروني
│       ├── models/
│       │   ├── User.js
│       │   ├── Student.js
│       │   ├── Announcement.js
│       │   ├── Review.js
│       │   ├── SocialPost.js
│       │   └── Settings.js
│       ├── controllers/        # Business Logic
│       │   ├── auth.controller.js
│       │   ├── student.controller.js
│       │   ├── announcement.controller.js
│       │   ├── review.controller.js
│       │   ├── fees.controller.js
│       │   ├── social.controller.js
│       │   └── settings.controller.js
│       ├── routes/             # Route definitions only
│       │   ├── index.js        # يجمع كل الـ routes
│       │   ├── auth.routes.js
│       │   ├── student.routes.js
│       │   ├── announcement.routes.js
│       │   ├── review.routes.js
│       │   ├── fees.routes.js
│       │   ├── social.routes.js
│       │   └── settings.routes.js
│       ├── middleware/
│       │   ├── auth.js         # JWT protect + authorize
│       │   ├── upload.js       # Multer
│       │   ├── errorHandler.js # معالج مركزي للأخطاء
│       │   └── validate.js     # express-validator middleware
│       ├── validators/         # Validation rules
│       │   ├── auth.validator.js
│       │   ├── student.validator.js
│       │   ├── announcement.validator.js
│       │   └── review.validator.js
│       └── utils/
│           ├── asyncHandler.js # try/catch wrapper
│           └── ApiResponse.js  # توحيد شكل الـ responses
│
└── frontend/
    ├── index.html              # Landing Page
    ├── register.html           # تسجيل الطلاب
    ├── fees.html               # الرسوم الدراسية
    ├── links.html              # صفحة الروابط
    ├── admin/
    │   └── index.html          # لوحة التحكم
    └── assets/
        ├── css/
        │   └── variables.css   # CSS Design Tokens
        └── js/
            └── api.js          # Fetch wrapper مركزي
```

---

## 🚀 تشغيل المشروع

### الطريقة 1: تطوير محلي (بدون Docker)

```bash
# Backend
cd backend
cp .env.example .env
# عدّل .env بإعداداتك
npm install
npm run seed    # إنشاء أول admin (مرة واحدة فقط)
npm run dev     # يشغّل nodemon
```

```bash
# Frontend
cd frontend
npx serve .
# أو افتح index.html مباشرة في المتصفح
```

### الطريقة 2: Docker Compose

```bash
cd school_project
cp backend/.env.example backend/.env
# عدّل backend/.env
docker-compose up -d
```

---

## 🔌 API Endpoints

| Method   | Route                          | Auth         | الوظيفة                    |
|----------|--------------------------------|--------------|----------------------------|
| `POST`   | `/api/auth/login`              | ❌           | تسجيل الدخول               |
| `POST`   | `/api/auth/refresh`            | ❌           | تجديد token                |
| `POST`   | `/api/auth/logout`             | ✅ Protected | تسجيل الخروج               |
| `GET`    | `/api/auth/me`                 | ✅ Protected | بيانات المستخدم            |
| `GET`    | `/api/announcements`           | ❌           | الإعلانات النشطة            |
| `GET`    | `/api/announcements/admin`     | ✅ Editor+   | كل الإعلانات               |
| `POST`   | `/api/announcements`           | ✅ Editor+   | إنشاء إعلان                |
| `PUT`    | `/api/announcements/:id`       | ✅ Editor+   | تعديل إعلان                |
| `DELETE` | `/api/announcements/:id`       | ✅ Admin+    | حذف إعلان                  |
| `POST`   | `/api/students/register`       | ❌           | تسجيل طالبة                |
| `GET`    | `/api/students`                | ✅ Admin+    | قائمة الطلاب               |
| `PATCH`  | `/api/students/:id/status`     | ✅ Admin+    | تغيير حالة الطلب           |
| `GET`    | `/api/reviews`                 | ❌           | التقييمات الموافق عليها     |
| `POST`   | `/api/reviews`                 | ❌           | إرسال تقييم جديد            |
| `GET`    | `/api/reviews/admin`           | ✅ Editor+   | كل التقييمات               |
| `PATCH`  | `/api/reviews/:id/approve`     | ✅ Editor+   | الموافقة على تقييم          |
| `DELETE` | `/api/reviews/:id`             | ✅ Admin+    | حذف تقييم                  |
| `GET`    | `/api/fees`                    | ❌           | صور الرسوم الدراسية         |
| `POST`   | `/api/fees/upload`             | ✅ Admin+    | رفع صورة رسوم              |
| `DELETE` | `/api/fees/:filename`          | ✅ Admin+    | حذف صورة رسوم              |
| `GET`    | `/api/social`                  | ❌           | منشورات السوشيال            |
| `POST`   | `/api/social`                  | ✅ Editor+   | إضافة منشور يدوياً          |
| `POST`   | `/api/social/sync`             | ✅ Editor+   | مزامنة من Instagram        |
| `DELETE` | `/api/social/:id`              | ✅ Admin+    | حذف منشور                  |
| `GET`    | `/api/settings/public`         | ❌           | إعدادات عامة               |
| `PUT`    | `/api/settings/:key`           | ✅ Admin+    | تعديل إعداد                |
| `GET`    | `/api/health`                  | ❌           | حالة الخادم                |

---

## 🔐 نظام الصلاحيات (RBAC)

| الدور         | القراءة | الإضافة/التعديل | الحذف الحساس | الإعدادات |
|---------------|---------|-----------------|--------------|-----------|
| `editor`      | ✅      | ✅              | ❌           | ❌        |
| `admin`       | ✅      | ✅              | ✅           | ✅        |
| `super_admin` | ✅      | ✅              | ✅           | ✅        |

---

## 🛡️ Security Features

- JWT Access Token (`15min`) + Refresh Token (`7d`) rotation
- RBAC: `super_admin` / `admin` / `editor`
- Helmet.js security headers
- Rate limiting: 100 req/15min per IP
- bcrypt password hashing (salt: 12 rounds)
- Input validation via express-validator
- Path traversal protection for file operations

---

## 🏗️ Architecture

```
Request → Route → [Validators] → [validate middleware] → Controller → Model → Response
                                                            ↓
                                                     asyncHandler (no try/catch)
                                                            ↓
                                                     errorHandler middleware
```
