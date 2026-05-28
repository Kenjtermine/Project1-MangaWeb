const db = require('../config/db');


async function submitRating(req, res, next) {
    const { userId, mangaId, rating_score} = req.body;
    if (!userId) return res.status(401).json({ message: 'Login is required' });
    if (!mangaId) return res.status(400).json({ message: 'mangaId is required' });
    if (!rating_score) return res.status(400).json({ message: 'rating_score is required' });
    query_submit_rating = `INSERT INTO ratings (user_id, manga_id, score)
    VALUES ($1, $2, $3)
    RETURNING *`;
    query_update_rating_stats= `
    UPDATE manga
    SET 
        avg_rating = ( SELECT AVG(score) FROM ratings WHERE manga_id = $1),
        rating_count = ( SELECT COUNT(*) FROM ratings WHERE manga_id = $1)
    WHERE manga_id = $1`;
    try {
       await db.query(query_submit_rating, [userId, mangaId, rating_score]);
       // Cập nhật lại điểm trung bình của manga
       await db.query(query_update_rating_stats, [mangaId]);
       return res.status(201).json({ message: 'Đã gửi đánh giá xếp hạng' });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Bạn đã đánh giá xếp hạng' });
        }
        if (error.code === '23514') {
            return res.status(400).json({ message: 'Đánh giá xếp hạng không hợp lệ' });
        }
        console.error('Error submitting rating:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getRatingStats(req, res, next) {
    const { mangaId } = req.params;
    if (!mangaId) {
        return res.status(400).json({ message: 'mangaId is required' });
    }

    const query = `SELECT avg_rating, rating_count FROM manga WHERE manga_id = $1`;
    try {
        const result = await db.query(query, [mangaId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Manga not found' });
        }
        const avgRating = parseFloat(result.rows[0].avg_rating) || 0;
        const ratingCount = parseInt(result.rows[0].rating_count) || 0;
        return res.status(200).json({ avg_rating: avgRating, rating_count: ratingCount });

    } catch (error) {
        console.error('Error fetching average rating:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    submitRating,
    getRatingStats
};