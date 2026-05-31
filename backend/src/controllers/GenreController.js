const db = require('../config/db');

async function getAllGenres(req, res, next) {
  try {
    const query = 'SELECT * FROM genres ORDER BY genre_name ASC';
    const result = await db.query(query);
    return res.status(200).json({ genres: result.rows });
  } catch (error) {
    return next(error);
  }
}

async function createGenre(req, res, next) {
  try {
    const genreName = (req.body.genre_name || req.body.name || '').trim();
    const genreDescription = req.body.genre_description ?? req.body.description ?? null;

    if (!genreName) {
      return res.status(400).json({ message: 'Tên thể loại là bắt buộc' });
    }

    const result = await db.query(
      'INSERT INTO genres (genre_name, genre_description) VALUES ($1, $2) RETURNING *',
      [genreName, genreDescription]
    );
    return res.status(201).json({ genre: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Thể loại đã tồn tại' });
    }
    return next(error);
  }
}

async function updateGenre(req, res, next) {
  try {
    const { genreId } = req.params;
    const genreName = req.body.genre_name ?? req.body.name;
    const genreDescription = req.body.genre_description ?? req.body.description;

    const result = await db.query(
      `
        UPDATE genres
        SET
          genre_name = COALESCE($1, genre_name),
          genre_description = COALESCE($2, genre_description)
        WHERE genre_id = $3
        RETURNING *
      `,
      [genreName?.trim() || null, genreDescription ?? null, genreId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thể loại' });
    }

    return res.status(200).json({ genre: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Thể loại đã tồn tại' });
    }
    return next(error);
  }
}

async function deleteGenre(req, res, next) {
  try {
    const genreId = req.params.genreId ?? req.body.genre_id;
    const result = await db.query('DELETE FROM genres WHERE genre_id = $1 RETURNING *', [genreId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thể loại' });
    }

    return res.status(200).json({ message: 'Đã xóa thể loại', genre: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

async function getGenreById(req, res, next) {
  try {
    const { genreId } = req.params;
    const query = 'SELECT * FROM genres WHERE genre_id = $1';
    const result = await db.query(query, [genreId]);    
    return res.status(200).json({ genre: result.rows[0] });    
  } catch (error) {
    return next(error);
  }
}

async function getGenresByMangaId(req, res, next) {
  try {
    const { mangaId } = req.params;
    const query = `
      SELECT g.genre_id, g.genre_name, g.genre_description
      FROM genres g
      INNER JOIN manga_genres mg ON g.genre_id = mg.genre_id
      WHERE mg.manga_id = $1
      ORDER BY g.genre_name ASC
    `;
    const result = await db.query(query, [mangaId]);
    return res.status(200).json({ genres: result.rows });
  } catch (error) {
    return next(error);
  }
}

async function getMangasByGenreId(req, res, next) {
  try {
    const { genreId } = req.params;
    const query = `
      SELECT
        m.manga_id,
        m.manga_title,
        m.manga_slug,
        m.manga_author,
        m.manga_summary,
        m.manga_cover_image,
        m.manga_status,
        m.publish_year,
        m.avg_rating,
        m.rating_count,
        m.total_views,
        m.created_at,
        m.updated_at
      FROM manga m
      INNER JOIN manga_genres mg ON m.manga_id = mg.manga_id
      WHERE mg.genre_id = $1
      ORDER BY m.updated_at DESC
    `;
    const result = await db.query(query, [genreId]);
    return res.status(200).json({ mangas: result.rows });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
    getAllGenres,
    createGenre,
    updateGenre,
    deleteGenre,
    getGenreById,
    getGenresByMangaId,
    getMangasByGenreId
};