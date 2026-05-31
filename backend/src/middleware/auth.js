const { verifyToken } = require('../config/jwt');
const db = require('../config/db');

// Middleware xác thực token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token không được tìm thấy' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }

  try {
    const result = await db.query(
      'SELECT user_id, user_name, user_email, user_role, is_banned FROM users WHERE user_id = $1',
      [decoded.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    const dbUser = result.rows[0];

    if (dbUser.is_banned) {
      return res.status(403).json({ message: 'Tài khoản này đang bị khóa.' });
    }

    req.user = {
      user_id: dbUser.user_id,
      user_name: dbUser.user_name,
      user_email: dbUser.user_email,
      user_role: dbUser.user_role,
    };
    next();
  } catch (error) {
    next(error);
  }
}

// Middleware kiểm tra quyền (role)
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    if (!allowedRoles.includes(req.user.user_role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole
};
