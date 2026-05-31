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
    folder: 'mangaweb_covers', // Ảnh sẽ vào thư mục này
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// Route : POST /api/manga
router.post('/', upload.single('coverImage'), mangaController.createManga);
router.get('/my-comics', mangaController.getMyMangas);
router.post('/chapters', upload.array('pages', 50), chapterController.createChapter);
module.exports = router;