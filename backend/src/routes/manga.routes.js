const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/MangaController');

// Route : POST /api/manga
router.post('/', mangaController.createManga);

module.exports = router;