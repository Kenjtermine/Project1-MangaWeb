// API endpoints for comments
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');

router.get('/get-comments', commentController.getComments);
router.post('/create-comment', commentController.createComment);
router.post('/delete-comment', commentController.deleteComment);
router.post('/reaction', commentController.toggleCommentReaction);

module.exports = router;
