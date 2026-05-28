const dotenv = require('dotenv');

dotenv.config();
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
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production'
};

module.exports = env;
