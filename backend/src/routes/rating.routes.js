const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/RatingController');
const { authenticateToken } = require('../middleware/auth');

router.post('/submit-rating', authenticateToken, ratingController.submitRating);
// Thông tin public, không cần xác thực
router.get('/get-rating-stats/:mangaId', ratingController.getRatingStats);  

module.exports = router;