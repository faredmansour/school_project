const express = require('express');
const router = express.Router();
const SocialPost = require('../models/SocialPost');
const { protect, authorize } = require('../middleware/auth');
const mongoose = require('mongoose');

// Helper to get Settings model dynamically
const getSettingsModel = () => {
  return mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({
    key: { type: String, unique: true, required: true },
    value: { type: mongoose.Schema.Types.Mixed },
  }));
};

// GET /api/social — Public: get all social posts
router.get('/', async (req, res) => {
  try {
    const posts = await SocialPost.find().sort({ publishedAt: -1 }).limit(12);
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب منشورات السوشيال ميديا' });
  }
});

// POST /api/social — Protected: add a social post manually
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), async (req, res) => {
  try {
    const { url, mediaUrl, caption, platform, publishedAt } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'رابط المنشور مطلوب' });
    }

    const post = await SocialPost.create({
      url,
      mediaUrl: mediaUrl || null,
      caption: caption || '',
      platform: platform || 'instagram',
      publishedAt: publishedAt || new Date(),
    });

    res.status(201).json({ success: true, data: post, message: 'تمت إضافة المنشور بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في إضافة المنشور' });
  }
});

// DELETE /api/social/:id — Protected: delete a social post
router.delete('/:id', protect, authorize('super_admin', 'admin'), async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'المنشور غير موجود' });
    }
    res.json({ success: true, message: 'تم حذف المنشور بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حذف المنشور' });
  }
});

// POST /api/social/sync — Protected: sync posts from Instagram API
router.post('/sync', protect, authorize('super_admin', 'admin', 'editor'), async (req, res) => {
  try {
    const Settings = getSettingsModel();
    const tokenSetting = await Settings.findOne({ key: 'instagram_token' });
    const token = tokenSetting ? tokenSetting.value : null;

    if (!token) {
      // Seed demo data if the database is empty
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
          }
        ];
        await SocialPost.insertMany(demoPosts);
        return res.json({ success: true, message: 'تمت إضافة منشورات تجريبية لعدم وجود توكن إنستقرام.' });
      }
      return res.status(400).json({
        success: false,
        message: 'لم يتم العثور على رمز اتصال إنستقرام (instagram_token) في إعدادات الموقع. يرجى إضافته أولاً أو إضافة منشورات يدوياً.'
      });
    }

    // Attempt to fetch from Instagram API
    const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${token}`);
    if (!response.ok) {
      throw new Error('فشل جلب البيانات من API إنستقرام');
    }
    const data = await response.json();
    
    if (data && data.data) {
      let syncedCount = 0;
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
      return res.json({ success: true, message: `تمت المزامنة بنجاح! تم استيراد ${syncedCount} منشورات جديدة.` });
    }
    
    res.json({ success: true, message: 'لم يتم العثور على منشورات جديدة.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء المزامنة: ' + err.message });
  }
});

module.exports = router;
