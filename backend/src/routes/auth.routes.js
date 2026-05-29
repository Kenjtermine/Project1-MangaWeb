// API endpoints for authentication
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/update-user-access', authenticateToken, authController.updateUserAccess);

module.exports = router;
