const db = require('../config/db');

const generateSlug = (title) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

async function createManga(req, res, next) {
  try {
    const { title, author, summary, coverImage } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author are required' });
    }

    const slug = generateSlug(title);
    const status = 'ongoing'; 
    const insertResult = await db.query(
      `
        INSERT INTO manga (
          manga_title,
          manga_slug,
          manga_author,
          manga_summary,
          manga_cover_image,
          manga_status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [title, slug, author, summary || '', coverImage || '', status]
    );

    const newManga = insertResult.rows[0];

    return res.status(201).json({ 
      message: 'Thêm truyện thành công, đang chờ Admin duyệt!',
      manga: newManga 
    });

  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createManga
};