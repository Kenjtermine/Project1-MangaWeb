const db = require('../config/db');

async function getComments(req, res, next) {
  try {
    const chapterId = Number(req.query.chapterId || 1);

    if (!Number.isInteger(chapterId) || chapterId <= 0) {
      return res.status(400).json({ message: 'chapterId is invalid' });
    }

    const result = await db.query(
      `
        SELECT
          c.comment_id,
          c.chapter_id,
          c.user_id,
          c.parent_comment_id,
          c.root_comment_id,
          c.content,
          c.like_count,
          c.dislike_count,
          c.is_deleted,
          c.created_at,
          c.updated_at,
          u.user_name AS "user",
          u.user_avatar AS avatar
        FROM comments c
        LEFT JOIN users u ON u.user_id = c.user_id
        WHERE c.chapter_id = $1 AND c.is_deleted = false
        ORDER BY c.created_at DESC
      `,
      [chapterId]
    );

    return res.json({ comments: result.rows });
  } catch (error) {
    return next(error);
  }
}

async function createComment(req, res, next) {
  try {
    const {
      userId,
      chapterId,
      content,
      parentCommentId = null,
      rootCommentId = null
    } = req.body;

    const normalizedContent = typeof content === 'string' ? content.trim() : '';

    if (!userId) return res.status(401).json({ message: 'Login is required' });
    if (!chapterId) return res.status(400).json({ message: 'chapterId is required' });
    if (!normalizedContent) return res.status(400).json({ message: 'content is required' });
    if (normalizedContent.length > 1000) {
      return res.status(400).json({ message: 'content must be at most 1000 characters' });
    }

    const insertResult = await db.query(
      `
        INSERT INTO comments (
          chapter_id,
          user_id,
          parent_comment_id,
          root_comment_id,
          content
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        Number(chapterId),
        Number(userId),
        parentCommentId ? Number(parentCommentId) : null,
        rootCommentId ? Number(rootCommentId) : null,
        normalizedContent
      ]
    );

    const comment = insertResult.rows[0];

    if (!rootCommentId && !parentCommentId) {
      await db.query(
        'UPDATE comments SET root_comment_id = $1 WHERE comment_id = $1',
        [comment.comment_id]
      );
      comment.root_comment_id = comment.comment_id;
    }

    return res.status(201).json({ comment });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getComments,
  createComment
};
