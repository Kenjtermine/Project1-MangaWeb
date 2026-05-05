// API endpoints for comments
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');

router.get('/', commentController.getComments);
router.post('/', commentController.createComment);

module.exports = router;
