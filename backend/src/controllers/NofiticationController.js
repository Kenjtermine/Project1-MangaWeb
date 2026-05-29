const db = require('../config/db');

async function getNotifications(req, res, next) {
    try {
        const userId = req.user?.user_id;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        const result = await db.query(
            `
                SELECT n.notification_id, n.user_id, n.type, n.content, n.target_url, n.is_read, n.created_at
                FROM notifications n
                WHERE n.user_id = $1
                ORDER BY n.created_at DESC LIMIT 15
            `,
            [userId]
        );
        return res.json({ data: result.rows });
    } catch (error) {
        return next(error);
    }
}

async function markAsRead(req, res, next) {
    try {
        const userId = req.user?.user_id;
        const { notificationId } = req.body;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        if (!notificationId) return res.status(400).json({ message: 'notificationId is required' });
        await db.query(
            `
                UPDATE notifications
                SET is_read = true
                WHERE notification_id = $1 AND user_id = $2
            `,
            [notificationId, userId]
        );
        return res.json({ message: 'Notification marked as read' });
    } catch (error) {
        return next(error);
    }
}

async function markAllAsRead(req, res, next) {
    try {
        const userId = req.user?.user_id;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        const result = await db.query(
            `
                UPDATE notifications
                SET is_read = true
                WHERE user_id = $1
            `,
            [userId]
        );
        return res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        return next(error);
    }
}

async function unreadCount(req, res, next) {
    try {
        const userId = req.user?.user_id;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        const result = await db.query(
            `
                SELECT COUNT(*) AS count
                FROM notifications
                WHERE user_id = $1 AND is_read = false
            `,
            [userId]
        );
        return res.json({ data: { count: parseInt(result.rows[0].count) } });
    } catch (error) {
        return next(error);
    }
}

async function deleteReadedNotifications(req, res, next) {
    try {
        const userId = req.user?.user_id;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        const result = await db.query(
            `
                DELETE FROM notifications
                WHERE user_id = $1 AND is_read = true
            `,
            [userId]
        );
        return res.json({ message: 'Read notifications deleted' });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    deleteReadedNotifications
};



