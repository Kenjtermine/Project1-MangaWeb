const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/FavoriteController');

router.post('/toggle-favorite', favoriteController.toggleFavorite);
router.get('/check-is-favorited', favoriteController.checkIsFavorited);
router.get('/get-total-favorites/:mangaId', favoriteController.getTotalFavorites);
router.get('/get-user-favorites/:userId', favoriteController.getUserFavorites);

module.exports = router;