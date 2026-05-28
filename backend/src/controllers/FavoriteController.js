const db = require('../config/db');

async function toggleFavorite(req, res) {
    const { userId, mangaId } = req.body;

    if (!userId || !mangaId) {
        return res.status(400).json({ message: 'Thiếu userId hoặc mangaId' });
    }

    try {
        const checkQuery = `SELECT 1 FROM user_favorites WHERE user_id = $1 AND manga_id = $2`;
        const checkResult = await db.query(checkQuery, [userId, mangaId]);

        let isFavorited = false;

        if (checkResult.rows.length > 0) {

            await db.query(`DELETE FROM user_favorites WHERE user_id = $1 AND manga_id = $2`, [userId, mangaId]);
            isFavorited = false;
        } else {

            await db.query(`INSERT INTO user_favorites (user_id, manga_id) VALUES ($1, $2)`, [userId, mangaId]);
            isFavorited = true;
        }


        return res.status(200).json({ 
            message: isFavorited ? 'Đã thêm vào tủ truyện' : 'Đã xóa khỏi tủ truyện',
            isFavorited: isFavorited 
        });

    } catch (error) {
        console.error('Lỗi khi toggle favorite:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

/**
 * 2. KIỂM TRA TRẠNG THÁI TIM (Dùng để tô màu icon trái tim khi load trang)
 */
async function checkIsFavorited(req, res) {
    const { userId, mangaId } = req.query; 

    if (!userId || !mangaId) return res.status(400).json({ message: 'Thiếu thông tin' });

    try {
        const query = `SELECT 1 FROM user_favorites WHERE user_id = $1 AND manga_id = $2 LIMIT 1`;
        const result = await db.query(query, [userId, mangaId]);
        
        const isFavorited = result.rows.length > 0;
        
        return res.status(200).json({ isFavorited });
    } catch (error) {
        console.error('Lỗi check favorite:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

/**
 * 3. LẤY TỔNG SỐ LƯỢT TIM CỦA 1 TRUYỆN
 */
async function getTotalFavorites(req, res) {
    const { mangaId } = req.params;

    if (!mangaId) return res.status(400).json({ message: 'Thiếu mangaId' });

    try {
        const query = `SELECT COUNT(*) as total_fav FROM user_favorites WHERE manga_id = $1`;
        const result = await db.query(query, [mangaId]);
        
        const totalFavorites = parseInt(result.rows[0].total_fav, 10);
        
        return res.status(200).json({ totalFavorites });
    } catch (error) {
        console.error('Lỗi lấy tổng favorite:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

/**
 * 4. LẤY DANH SÁCH TRUYỆN TỦ CỦA USER (Hiển thị ở trang Profile)
 */
async function getUserFavorites(req, res) {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: 'Thiếu userId' });

    try {
        const query = `
            SELECT 
                m.manga_id, 
                m.manga_title, 
                m.manga_slug, 
                m.manga_cover_image, 
                uf.created_at as favorited_at
            FROM user_favorites uf
            JOIN manga m ON uf.manga_id = m.manga_id
            WHERE uf.user_id = $1
            ORDER BY uf.created_at DESC
        `;
        
        const result = await db.query(query, [userId]);
        
        return res.status(200).json({ 
            favorites: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách truyện tủ:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

module.exports = {
    toggleFavorite,
    checkIsFavorited,
    getTotalFavorites,
    getUserFavorites
};