const { verifyToken } = require('../config/jwt');

// Middleware xác thực token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Token không được tìm thấy' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }

  // Lưu thông tin user vào request
  req.user = decoded;
  next();
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
