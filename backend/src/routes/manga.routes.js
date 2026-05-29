const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/MangaController');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dqbrifz8f',
  api_key: '942567316844217',
  api_secret: '7l7zz7AdbHGnbz0C4cVJkLyH6XM'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mangaweb_covers', // Ảnh sẽ vào thư mục này
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// Route : POST /api/manga
router.post('/', upload.single('coverImage'), mangaController.createManga);

module.exports = router;