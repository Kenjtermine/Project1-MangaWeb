const { Pool } = require('pg');
const env = require('./env');

function buildPoolConfig() {
  // Kiểm tra nếu env.databaseUrl tồn tại, không bị rỗng, và không phải là chuỗi chữ "undefined"
  if (env.databaseUrl && String(env.databaseUrl).trim() !== '' && String(env.databaseUrl) !== 'undefined') {
    console.log("🔌 Đang kết nối Database bằng: Connection String (DATABASE_URL)");
    return {
      connectionString: env.databaseUrl,
      ssl: env.dbSsl ? { rejectUnauthorized: false } : false
    };
  }

  // Nếu không có databaseUrl, tự động chuyển sang cấu hình bằng Object lẻ từng biến
  console.log("🔌 Đang kết nối Database bằng: Cấu hình tài khoản lẻ (Host, Port, User...)");
  return {
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
    ssl: env.dbSsl ? { rejectUnauthorized: false } : false
  };
}

// Gọi cấu hình
const poolConfig = buildPoolConfig();
const pool = new Pool(poolConfig);

async function connectDB() {
  try {
    // In ra giá trị thực tế để kiểm tra khi server run
    console.log("🔍 Kiểm tra giá trị env.databaseUrl thực tế đang nhận:", env.databaseUrl);
    
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected to Neon Cloud!');
  } catch (error) {
    console.error('❌ LỖI KẾT NỐI DATABASE THỰC TẾ:', error.message);
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