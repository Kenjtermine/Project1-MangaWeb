const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/FavoriteController');
const { authenticateToken } = require('../middleware/auth');

router.post('/toggle-favorite', authenticateToken, favoriteController.toggleFavorite);
router.get('/check-is-favorited', authenticateToken, favoriteController.checkIsFavorited);
router.get('/get-user-favorites', authenticateToken, favoriteController.getUserFavorites);
router.get('/get-user-favorites/:userId', authenticateToken, favoriteController.getUserFavorites);
// Thông tin public, không cần xác thực
router.get('/get-total-favorites/:mangaId', favoriteController.getTotalFavorites);

module.exports = router;
