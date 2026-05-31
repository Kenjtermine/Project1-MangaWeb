const dotenv = require('dotenv');
const path = require('path'); // Thêm thư viện có sẵn này của Node.js

// Ép dotenv tìm đúng file .env nằm ở thư mục backend gốc (đi ngược từ src/config/ ra 2 cấp)
dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log("👉 CHECK DATABASE URL TỪ ENV:", process.env.DATABASE_URL);

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'mangaweb',
  dbSsl: String(process.env.DB_SSL || 'false').toLowerCase() === 'true',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your_super_secret_jwt_key_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || ''
};

module.exports = env;