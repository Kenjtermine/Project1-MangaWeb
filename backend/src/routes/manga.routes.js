const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/MangaController');
const chapterController = require('../controllers/ChapterController');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const env = require('../config/env');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mangaweb_covers', 
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// 🔥 HÀM BỌC AN TOÀN CHỐNG CRASH SERVER KHI MERGE CODE LỆCH TÊN HÀM
const safeCallback = (controller, methodName) => {
  return (req, res, next) => {
    if (controller && typeof controller[methodName] === 'function') {
      return controller[methodName](req, res, next);
    }
    console.error(`🚨 Lỗi hệ thống: Hàm [${methodName}] chưa được định nghĩa hoặc bị viết sai tên trong Controller!`);
    return res.status(500).json({ 
      message: `Tính năng này (hàm ${methodName}) hiện tại chưa khả dụng hoặc bị lỗi cấu trúc khi merge code.` 
    });
  };
};

// ==========================================
// CÁC ROUTE TĨNH (Đặt lên đầu)
// ==========================================
router.get('/rankings', safeCallback(mangaController, 'getDashboardRankings'));
router.post('/log-view', safeCallback(mangaController, 'logView'));
router.get('/my-comics', safeCallback(mangaController, 'getMyMangas'));
router.get('/', safeCallback(mangaController, 'getMangaList'));

// ==========================================
// CÁC ROUTE XỬ LÝ DỮ LIỆU BẰNG POST (UPLOAD)
// ==========================================
router.post('/', upload.single('coverImage'), safeCallback(mangaController, 'createManga'));
router.post('/chapters', upload.array('pages', 50), safeCallback(chapterController, 'createChapter'));

// ==========================================
// CÁC ROUTE ĐỘNG DÙNG PARAMS (Đặt cuối cùng)
// ==========================================
router.get('/id/:id', safeCallback(mangaController, 'getMangaById'));
router.get('/slug/:slug', safeCallback(mangaController, 'getMangaBySlug'));
router.get('/:mangaId/chapters', safeCallback(chapterController, 'getChaptersByMangaId'));
router.get('/chapters/:chapterId/pages', safeCallback(chapterController, 'getPagesByChapterId'));

module.exports = router;