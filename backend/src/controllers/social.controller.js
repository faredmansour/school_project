const SocialPost = require('../models/SocialPost');
const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ─── GET /api/social ──────────────────────────────────────────────────────
exports.getAll = asyncHandler(async (req, res) => {
  const posts = await SocialPost.find().sort({ publishedAt: -1 }).limit(12);
  ApiResponse.ok(res, 'تم جلب المنشورات', posts);
});

// ─── POST /api/social ─────────────────────────────────────────────────────
exports.create = asyncHandler(async (req, res) => {
  const { url, mediaUrl, caption, platform, publishedAt } = req.body;
  if (!url) {
    return ApiResponse.badRequest(res, 'رابط المنشور مطلوب');
  }

  const post = await SocialPost.create({
    url,
    mediaUrl: mediaUrl || null,
    caption: caption || '',
    platform: platform || 'instagram',
    publishedAt: publishedAt || new Date(),
  });
  ApiResponse.created(res, 'تمت إضافة المنشور بنجاح', post);
});

// ─── DELETE /api/social/:id ───────────────────────────────────────────────
exports.remove = asyncHandler(async (req, res) => {
  const post = await SocialPost.findByIdAndDelete(req.params.id);
  if (!post) return ApiResponse.notFound(res, 'المنشور غير موجود');
  ApiResponse.ok(res, 'تم حذف المنشور بنجاح');
});

// ─── POST /api/social/sync ────────────────────────────────────────────────
exports.sync = asyncHandler(async (req, res) => {
  const tokenSetting = await Settings.findOne({ key: 'instagram_token' });
  const token = tokenSetting ? tokenSetting.value : null;

  if (!token) {
    const count = await SocialPost.countDocuments();
    if (count === 0) {
      const demoPosts = [
        {
          url: 'https://instagram.com/p/demo1',
          mediaUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500',
          caption: 'من فعاليات اليوم المفتوح لطالباتنا المتميزات 🌟✨ #مدرسة_رواد #تعليم_بنات',
          platform: 'instagram',
          postId: 'demo_ig_1',
          publishedAt: new Date(),
        },
        {
          url: 'https://instagram.com/p/demo2',
          mediaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500',
          caption: 'تكريم طالبات الصف الثاني الابتدائي الحافظات للقرآن الكريم 🌸🏆 هنيئاً لجميع المتميزات.',
          platform: 'instagram',
          postId: 'demo_ig_2',
          publishedAt: new Date(Date.now() - 86400000),
        },
        {
          url: 'https://instagram.com/p/demo3',
          mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
          caption: 'أعمال طالبات المرحلة الثانوية في معرض الفنون والابتكار 🎨💡 فخورون بإبداعاتكن.',
          platform: 'instagram',
          postId: 'demo_ig_3',
          publishedAt: new Date(Date.now() - 86400000 * 2),
        },
      ];
      await SocialPost.insertMany(demoPosts);
      return ApiResponse.ok(res, 'تمت إضافة منشورات تجريبية لعدم وجود توكن إنستقرام.');
    }
    return ApiResponse.badRequest(
      res,
      'لم يتم العثور على رمز اتصال إنستقرام (instagram_token) في إعدادات الموقع. يرجى إضافته أولاً.'
    );
  }

  // مزامنة حقيقية من Instagram API
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${token}`
  );
  if (!response.ok) throw new Error('فشل جلب البيانات من API إنستقرام');

  const data = await response.json();
  let syncedCount = 0;

  if (data && data.data) {
    for (const item of data.data) {
      if (item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM') {
        const existing = await SocialPost.findOne({ postId: item.id });
        if (!existing) {
          await SocialPost.create({
            postId: item.id,
            url: item.permalink,
            mediaUrl: item.media_url,
            caption: item.caption || '',
            platform: 'instagram',
            publishedAt: new Date(item.timestamp),
          });
          syncedCount++;
        }
      }
    }
  }

  ApiResponse.ok(res, `تمت المزامنة بنجاح! تم استيراد ${syncedCount} منشورات جديدة.`);
});
