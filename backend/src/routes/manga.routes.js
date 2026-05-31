const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/MangaController');
const chapterController = require('../controllers/ChapterController');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const env = require('../config/env');

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

// ==========================================
// CÁC ROUTE TĨNH (Nên đặt lên đầu)
// ==========================================
router.get('/rankings', mangaController.getDashboardRankings);
router.post('/log-view', mangaController.logView);
router.get('/my-comics', mangaController.getMyMangas);
router.get('/', mangaController.getMangaList);

// ==========================================
// CÁC ROUTE XỬ LÝ DỮ LIỆU BẰNG POST (UPLOAD)
// ==========================================
router.post('/', upload.single('coverImage'), mangaController.createManga);
router.post('/chapters', upload.array('pages', 50), chapterController.createChapter);

// ==========================================
// CÁC ROUTE ĐỘNG DÙNG PARAMS (Nên đặt cuối cùng)
// ==========================================
router.get('/id/:id', mangaController.getMangaById);
router.get('/slug/:slug', mangaController.getMangaBySlug);
router.get('/:mangaId/chapters', chapterController.getChaptersByMangaId);
router.get('/chapters/:chapterId/pages', chapterController.getPagesByChapterId);

module.exports = router;