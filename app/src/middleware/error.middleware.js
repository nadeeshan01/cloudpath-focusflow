const logger = require('../utils/logger');

function notFound(req, res) {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}

function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode || error.status || 500;
  const method = req ? req.method : 'UNKNOWN';
  const url = req ? req.originalUrl || req.url || '' : '';

  logger.error(
    `[${method}] ${url} - Status ${statusCode} - ${error.message || 'Application error'}`,
    {
      event: 'application_error',
      method,
      url,
      statusCode,
      stack: error.stack,
    }
  );

  if (error.name === 'ValidationError') {
    const messages = error.errors
      ? Object.values(error.errors).map((e) => e.message)
      : [error.message];
    return res.status(400).json({
      success: false,
      message: messages[0] || 'Database validation failed',
    });
  }

  if (error.code === 11000 || error.code === 11001) {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
    });
  }

  const isDev = (process.env.NODE_ENV || 'development') !== 'production';
  return res.status(statusCode).json({
    success: false,
    message:
      statusCode < 500 || isDev
        ? error.message || 'Internal server error'
        : 'Internal server error',
  });
}

module.exports = {
  notFound,
  errorHandler,
};
