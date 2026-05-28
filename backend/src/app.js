
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Define API routes
const commentRoutes = require('./routes/comment.routes');
const authRoutes = require('./routes/auth.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const ratingRoutes = require('./routes/rating.routes');

const app = express();

app.use(
  cors({
    origin: env.clientUrl
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/rating', ratingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
