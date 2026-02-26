function notFound(req, res, next) {
  const error = new Error('Resource not found');
  error.statusCode = 404;
  next(error);
}

module.exports = notFound;
