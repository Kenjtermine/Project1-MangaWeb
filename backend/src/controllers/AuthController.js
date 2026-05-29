const db = require('../config/db');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyToken, jwtConfig } = require('../config/jwt');

function toPublicUser(row) {
  return {
    user_id: row.user_id,
    user_name: row.user_name,
    user_email: row.user_email,
    user_avatar: row.user_avatar,
    user_gender: row.user_gender,
    user_role: row.user_role,
    created_at: row.created_at
  };
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await db.query(
      'SELECT * FROM users WHERE lower(user_name) = lower($1) OR lower(user_email) = lower($1)',
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const foundUser = user.rows[0];

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, foundUser.user_password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (foundUser.is_banned) {
      return res.status(403).json({ message: 'Tài khoản này đang bị khóa.' });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    await db.query(
      'UPDATE users SET refresh_token = $1 WHERE user_id = $2',
      [refreshToken, foundUser.user_id]
    );

    return res.status(200).json({
      message: 'Đăng nhập thành công.',
      accessToken,
      refreshToken,
      expiresIn: jwtConfig.EXPIRES_IN,
      user: toPublicUser(foundUser)
    });
  } catch (error) {
    next(error);
  }
}

async function refreshAccessToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token được yêu cầu' });
    }

    // Verify refresh token trước
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }

    const user = await db.query(
      'SELECT * FROM users WHERE user_id = $1',
      [decoded.user_id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const foundUser = user.rows[0];

    if (foundUser.refresh_token !== refreshToken) {
      return res.status(401).json({ message: 'Refresh token khong hop le hoac da het han' });
    }

    if (foundUser.is_banned) {
      return res.status(403).json({ message: 'Tai khoan nay dang bi khoa.' });
    }

    const newAccessToken = generateAccessToken(foundUser);

    return res.status(200).json({
      message: 'Token đã được cập nhật',
      accessToken: newAccessToken,
      expiresIn: jwtConfig.EXPIRES_IN
    });
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ message: 'Tên người dùng cần ít nhất 3 ký tự.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email không hợp lệ.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu cần ít nhất 6 ký tự.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu nhập lại không khớp.' });
    }

    // Check if username already exists
    const existingUsername = await db.query(
      'SELECT * FROM users WHERE lower(user_name) = lower($1)',
      [username.trim()]
    );

    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ message: 'Tên người dùng đã tồn tại.' });
    }

    // Check if email already exists
    const existingEmail = await db.query(
      'SELECT * FROM users WHERE lower(user_email) = lower($1)',
      [email.trim()]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ message: 'Email đã tồn tại.' });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await db.query(
      `INSERT INTO users (user_name, user_email, user_password, user_avatar, user_gender, user_role, is_banned, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING user_id, user_name, user_email, user_avatar, user_gender, user_role, created_at`,
      [
        username.trim(),
        email.trim(),
        hashedPassword,
        'https://i.imgur.com/1n7f1bF.jpg', // Default avatar
        'other',
        'user',
        false
      ]
    );

    const user = newUser.rows[0];
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await db.query(
      'UPDATE users SET refresh_token = $1 WHERE user_id = $2',
      [refreshToken, user.user_id]
    );

    return res.status(201).json({
      message: 'Đăng ký thành công.',
      accessToken,
      refreshToken,
      expiresIn: jwtConfig.EXPIRES_IN,
      user: toPublicUser(user)
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserAccess(req, res, next) {
  try {
    const { userId, isBanned, userRole } = req.body;
    const currentUser = req.user;

    if (!currentUser?.user_id) {
      return res.status(401).json({ message: 'Login is required' });
    }

    const isAdmin = currentUser.user_role === 'admin';
    const targetUserId = isAdmin && userId ? Number(userId) : Number(currentUser.user_id);

    // Ít nhất một trường phải có
    if (isBanned === undefined && userRole === undefined) {
      return res.status(400).json({ message: 'At least one field are required' });
    }

    if (!isAdmin) {
      if (isBanned !== undefined) {
        return res.status(403).json({ message: 'You are not allowed to change ban status' });
      }

      if (userRole && userRole !== 'uploader') {
        return res.status(403).json({ message: 'You are not allowed to assign this role' });
      }
    }

    const user = await db.query(
      'SELECT * FROM users WHERE user_id = $1',
      [targetUserId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isBannedParam = isBanned !== undefined ? isBanned : null;
    const userRoleParam = userRole !== undefined ? userRole : null;

    const updatedUser = await db.query(
      `UPDATE users 
      SET is_banned = COALESCE($1, is_banned), 
          user_role = COALESCE($2, user_role) 
      WHERE user_id = $3 
      RETURNING *`,
      [isBannedParam, userRoleParam, targetUserId]
    );

    return res.status(200).json({
      message: 'Đã cập nhật thông tin người dùng.',
      user: toPublicUser(updatedUser.rows[0])
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  login,
  register,
  updateUserAccess,
  refreshAccessToken
};
