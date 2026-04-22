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
  await pool.query('SELECT 1');
  console.log('PostgreSQL connected');
}

function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  connectDB,
  query,
  pool
};
