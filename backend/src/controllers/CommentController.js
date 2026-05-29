const db = require('../config/db');
const eventBus = require('../utils/eventBus');

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
    const userId = req.user?.user_id; // Get userId from token
    const {
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

    // if comment is a reply, nofity the parent comment's author
    if (parentCommentId) {
      try {
        const parentInfoResult = await db.query(`
          SELECT 
            c.user_id AS receiver_id, 
            ch.manga_id 
          FROM comments c
          JOIN chapters ch ON c.chapter_id = ch.chapter_id
          WHERE c.comment_id = $1
        `, [Number(parentCommentId)]);

        if (parentInfoResult.rows.length > 0) {
          const { receiver_id, manga_id } = parentInfoResult.rows[0];

          // Không gửi thông báo nếu user tự trả lời comment của chính mình
          if (receiver_id !== Number(userId)) {
            eventBus.emit('REPLY_COMMENT', {
              receiverId: receiver_id,
              message: `Đã trả lời bình luận của bạn: ${normalizedContent.substring(0, 50)}${normalizedContent.length > 50 ? '...' : ''}`, // Rút gọn text tránh tràn UI
              targetUrl: `/manga/${manga_id}/chapter/${chapterId}` 
            });
          }
        }
      } catch (notiError) {
        console.error('Lỗi khi truy xuất dữ liệu để bắn thông báo:', notiError);
      }
    }
      
    return res.status(201).json({ comment });
  } catch (error) {
    return next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const userId = req.user?.user_id;
    const userRole = req.user?.user_role;
    const { commentId } = req.body;
    const commentIdNum = Number(commentId);

    if (!userId) return res.status(401).json({ message: 'Login is required' });
    if (!Number.isInteger(commentIdNum) || commentIdNum <= 0) {
      return res.status(400).json({ message: 'commentId is invalid' });
    }

    const result = await db.query(
      `
        UPDATE comments
        SET is_deleted = true
        WHERE comment_id = $1
          AND (user_id = $2 OR $3 = 'admin')
        RETURNING comment_id
      `,
      [commentIdNum, Number(userId), userRole]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: 'You are not allowed to delete this comment' });
    }

    return res.json({ message: 'Comment deleted successfully', data: { commentId: commentIdNum } });
  } catch (error) {
    return next(error);
  }
}

async function toggleCommentReaction(req, res, next) {
  try {
    // 1. Lấy userId từ token (bảo mật) và data từ body
    const userId = req.user?.user_id; // Get userId from token
    const commentIdNum = Number(req.body.commentId);
    const { commentId, reactionType } = req.body; // reactionType chỉ nhận 'like' hoặc 'dislike'

    if (!userId) return res.status(401).json({ message: 'Login is required' });
    if (!['like', 'dislike'].includes(reactionType)) {
        return res.status(400).json({ message: "Loại reaction không hợp lệ" });
    }

    // 2. TĂNG/GIẢM TRỰC TIẾP TRÊN DATABASE MÀ KHÔNG CẦN FRONTEND GỬI SỐ LƯỢNG
    if (!Number.isInteger(commentIdNum) || commentIdNum <= 0) {
        return res.status(400).json({ message: "commentId is invalid" });
    }

    let updateQuery = "";
    if (reactionType === 'like') {
        updateQuery = 'UPDATE comments SET like_count = like_count + 1 WHERE comment_id = $1 RETURNING *';
    } else {
        updateQuery = 'UPDATE comments SET dislike_count = dislike_count + 1 WHERE comment_id = $1 RETURNING *';
    }

    const result = await db.query(updateQuery, [commentIdNum]);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    return res.status(200).json({ 
        message: "Thao tác thành công",
        comment: result.rows[0] // Trả về comment với số like mới nhất để Frontend cập nhật UI
    });

  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getComments,
  createComment,
  deleteComment,
  toggleCommentReaction
};
