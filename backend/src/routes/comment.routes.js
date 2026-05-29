// API endpoints for comments
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');
const { authenticateToken } = require('../middleware/auth');

router.get('/get-comments', commentController.getComments);

router.post('/create-comment', authenticateToken, commentController.createComment);
router.post('/delete-comment', authenticateToken, commentController.deleteComment);
router.post('/reaction', authenticateToken, commentController.toggleCommentReaction);

module.exports = router;
