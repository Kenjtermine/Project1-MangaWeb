const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/RatingController');

router.post('/submit-rating', ratingController.submitRating);
router.get('/get-rating-stats/:mangaId', ratingController.getRatingStats);  

module.exports = router;