
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Define API routes
const commentRoutes = require('./routes/comment.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(
  cors({
    origin: env.clientUrl
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
