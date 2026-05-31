/**
 * Backup createManga (phiên bản dùng poster_id trên bảng manga).
 * Giữ lại để tham khảo nếu sau này thêm cột poster_id vào schema.
 */
const db = require('../../config/db');

const generateSlug = (title) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

async function createManga(req, res, next) {
  try {
    const { title, author, summary, poster_id } = req.body;
    const coverImageUrl = req.file ? req.file.path : '';

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author are required' });
    }
    if (!poster_id) {
      return res.status(400).json({ message: 'Lỗi: Không tìm thấy ID người đăng truyện!' });
    }

    const slug = generateSlug(title);
    const status = 'ongoing';

    const insertResult = await db.query(
      `
        INSERT INTO manga (
          manga_title, manga_slug, manga_author, manga_summary, manga_cover_image, manga_status, poster_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [title, slug, author, summary || '', coverImageUrl, status, poster_id]
    );

    const newManga = insertResult.rows[0];

    return res.status(201).json({
      message: 'Thêm truyện thành công!',
      manga: newManga,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createManga };
