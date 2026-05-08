const db = require('../config/db');
const bcrypt = require('bcrypt');

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

    return res.status(200).json({
      message: 'Đăng nhập thành công.',
      user: toPublicUser(foundUser)
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

    if (!email.includes('@')) {
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

    return res.status(201).json({
      message: 'Đăng ký thành công.',
      user: toPublicUser(user)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register
};
