require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, HOST, () => {
  logger.info(`🚀 ${process.env.APP_NAME} started`, {
    port: PORT,
    host: HOST,
    environment: NODE_ENV,
    version: process.env.APP_VERSION || '0.1.0',
    nodeVersion: process.version,
    pid: process.pid,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
