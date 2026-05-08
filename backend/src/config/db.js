const { Pool } = require('pg');
const env = require('./env');

function buildPoolConfig() {
  if (env.databaseUrl) {
    return {
      connectionString: env.databaseUrl,
      ssl: env.dbSsl ? { rejectUnauthorized: false } : false
    };
  }

  return {
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
    ssl: env.dbSsl ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(buildPoolConfig());

async function connectDB() {
  try{
  await pool.query('SELECT 1');
      console.log('✅ PostgreSQL connected to Neon Cloud!');
    } catch (error) {
      console.error('❌ LỖI KẾT NỐI DATABASE:', error);
      // Nếu thích, bạn có thể thêm process.exit(1) để ép dừng server nếu DB lỗi
    }
}

function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  connectDB,
  query,
  pool
};
