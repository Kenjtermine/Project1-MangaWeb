const express = require('express');
const nofiticationController = require('../controllers/NofiticationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/notifications', authenticateToken, nofiticationController.getNotifications);
router.post('/notifications/read', authenticateToken, nofiticationController.markAsRead);
router.post('/notifications/all-read', authenticateToken, nofiticationController.markAllAsRead);
router.get('/notifications/unread-count', authenticateToken, nofiticationController.unreadCount);
router.delete('/notifications/delete-readed', authenticateToken, nofiticationController.deleteReadedNotifications);

module.exports = router;