const express = require('express');
const router = express.Router();
const genreController = require('../controllers/GenreController');

router.get('/get-genres', genreController.getAllGenres);
router.post('/create-genre', genreController.createGenre);
router.post('/delete-genre', genreController.deleteGenre);
router.get('/get-genre/:genreId', genreController.getGenreById);
router.get('/mangas-by-genre/:genreId', genreController.getMangasByGenreId);
router.get('/get-genres/:mangaId', genreController.getGenresByMangaId);

module.exports = router;