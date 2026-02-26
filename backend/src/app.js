const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: env.clientUrl
  })
);
app.use(express.json());

app.use(notFound);
app.use(errorHandler);

module.exports = app;
