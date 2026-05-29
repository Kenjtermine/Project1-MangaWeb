const eventBus = require('../utils/eventBus');
const db = require('../config/db');

async function createNotification(userId, type, content, targetUrl) {
    try {
        const query = `
            INSERT INTO notifications (user_id, type, content, target_url, created_at)
            VALUES ($1, $2, $3, $4, NOW())
        `;
        await db.query(query, [userId, type, content, targetUrl]);
    } catch (error) {
        console.error('[Lỗi DB] Không thể tạo thông báo ${type} cho user ${userId}:', error);
    }
}

eventBus.on('NEW_CHAPTER', async (data) => {
    console.log(`[Observer] Đang tạo thông báo ngầm cho user: ${data.receiverId}`);
    await createNotification (
        data.receiverId,
        'NEW_CHAPTER',
        data.message,
        data.targetUrl
    );
});

eventBus.on('SYSTEM_ALERT', async (data) => {
    console.log(`[Observer] Đang tạo thông báo ngầm cho user: ${data.receiverId}`);
    await createNotification (
        data.receiverId,
        'SYSTEM_ALERT',
        data.message,
        data.targetUrl
    );
});

eventBus.on('REPLY_COMMENT', async (data) => {
    console.log(`[Observer] Đang tạo thông báo ngầm cho user: ${data.receiverId}`);
    await createNotification (
        data.receiverId,
        'REPLY_COMMENT',
        data.message,
        data.targetUrl
    );
});

module.exports = {
    eventBus
};