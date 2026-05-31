const db = require('../config/db');

const generateSlug = (title) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

function parseGenreIds(body) {
  const raw = body.genreIds;
  if (raw === undefined || raw === null || raw === '') return [];

  if (Array.isArray(raw)) {
    return raw.map(Number).filter((id) => Number.isInteger(id) && id > 0);
  }

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(Number).filter((id) => Number.isInteger(id) && id > 0);
      }
    } catch {
      // fall through to comma-separated
    }
    return raw
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);
  }

  const single = Number(raw);
  return Number.isInteger(single) && single > 0 ? [single] : [];
}

async function createManga(req, res, next) {
  try {
    const { title, author, summary, status: bodyStatus } = req.body;
    const coverImageUrl = req.file ? req.file.path : '';
    const genreIds = parseGenreIds(req.body);

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author are required' });
    }

    const slug = generateSlug(title);
    const status = bodyStatus || 'ongoing';

    const insertResult = await db.query(
      `
        INSERT INTO manga (
          manga_title, manga_slug, manga_author, manga_summary, manga_cover_image, manga_status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [title, slug, author, summary || '', coverImageUrl, status]
    );

    const newManga = insertResult.rows[0];

    if (genreIds.length > 0) {
      const values = genreIds
        .map((_, index) => `($1, $${index + 2})`)
        .join(', ');
      await db.query(
        `INSERT INTO manga_genres (manga_id, genre_id) VALUES ${values} ON CONFLICT DO NOTHING`,
        [newManga.manga_id, ...genreIds]
      );
    }

    return res.status(201).json({
      message: 'Thêm truyện thành công!',
      manga: newManga,
      genreIds,
    });
  } catch (error) {
    return next(error);
  }
}

async function getMyMangas(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM manga ORDER BY created_at DESC');

    return res.status(200).json({
      message: 'Lấy dữ liệu thành công',
      mangas: result.rows,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createManga,
  getMyMangas,
};
