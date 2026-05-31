const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const adminController = require('../controllers/AdminController');
const authController = require('../controllers/AuthController');
const genreController = require('../controllers/GenreController');
const commentController = require('../controllers/CommentController');

const adminOnly = [authenticateToken, authorizeRole('admin')];

router.get('/stats', adminOnly, adminController.getOverviewStats);
router.get('/users', adminOnly, adminController.getAllUsers);
router.post('/users/access', adminOnly, authController.updateUserAccess);

router.get('/genres', adminOnly, genreController.getAllGenres);
router.post('/genres', adminOnly, genreController.createGenre);
router.put('/genres/:genreId', adminOnly, genreController.updateGenre);
router.delete('/genres/:genreId', adminOnly, genreController.deleteGenre);

router.get('/comments', adminOnly, commentController.getAdminComments);
router.delete('/comments/:commentId', adminOnly, commentController.adminDeleteComment);

module.exports = router;
