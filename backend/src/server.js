require('dotenv').config();
const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/db');

async function startServer() {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

startServer();
