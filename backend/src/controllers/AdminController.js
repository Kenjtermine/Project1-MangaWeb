const db = require('../config/db');

function toPublicUser(row) {
  return {
    user_id: row.user_id,
    user_name: row.user_name,
    user_email: row.user_email,
    user_avatar: row.user_avatar,
    user_gender: row.user_gender,
    user_role: row.user_role,
    is_banned: row.is_banned,
    created_at: row.created_at,
  };
}

async function getAllUsers(req, res, next) {
  try {
    const result = await db.query(
      `
        SELECT user_id, user_name, user_email, user_avatar, user_gender, user_role, is_banned, created_at
        FROM users
        ORDER BY created_at DESC
      `
    );
    return res.status(200).json({ users: result.rows.map(toPublicUser) });
  } catch (error) {
    return next(error);
  }
}

async function getOverviewStats(req, res, next) {
  try {
    const [users, mangas, genres, comments, banned] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS count FROM users'),
      db.query('SELECT COUNT(*)::int AS count FROM manga'),
      db.query('SELECT COUNT(*)::int AS count FROM genres'),
      db.query('SELECT COUNT(*)::int AS count FROM comments WHERE is_deleted = false'),
      db.query('SELECT COUNT(*)::int AS count FROM users WHERE is_banned = true'),
    ]);

    return res.status(200).json({
      stats: {
        totalUsers: users.rows[0].count,
        totalMangas: mangas.rows[0].count,
        totalGenres: genres.rows[0].count,
        totalComments: comments.rows[0].count,
        bannedUsers: banned.rows[0].count,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllUsers,
  getOverviewStats,
};
