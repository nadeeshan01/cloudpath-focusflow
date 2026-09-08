function notFound(req, res) {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}

function errorHandler(error, req, res, _next) {
  console.error(
    JSON.stringify({
      event: 'application_error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })
  );

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Database validation failed',
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode ? error.message : 'Internal server error',
  });
}

module.exports = {
  notFound,
  errorHandler,
};
