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
    const { genre_name } = req.body;
    const query = 'INSERT INTO genres (genre_name) VALUES ($1) RETURNING *';
    const result = await db.query(query, [genre_name]);
    return res.status(201).json({ genre: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

async function deleteGenre(req, res, next) {
  try {
    const genreId = req.params.genreId ?? req.body.genre_id;
    const query = 'DELETE FROM genres WHERE genre_id = $1 RETURNING *';
    const result = await db.query(query, [genreId]);
    return res.status(200).json({ genre: result.rows[0] });
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
    deleteGenre,
    getGenreById,
    getGenresByMangaId,
    getMangasByGenreId
};