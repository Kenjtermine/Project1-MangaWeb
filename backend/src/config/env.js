const dotenv = require('dotenv');
const path = require('path'); // 🚨 1. Import thêm thư viện path có sẵn của Node.js

// 🚨 2. SỬA DÒNG NÀY: Chỉ định chính xác vị trí file .env nằm ở thư mục gốc của backend
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
  dbPassword: process.env.DB_PASSWORD || '164493', 
  dbName: process.env.DB_NAME || 'mangaweb',
  dbSsl: String(process.env.DB_SSL || 'false').toLowerCase() === 'true',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production'
};

module.exports = env;