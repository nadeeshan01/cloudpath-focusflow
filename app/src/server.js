require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const { connectDB } = require('./config/db');
const env = require('./config/env');

const PORT = env.port;
const HOST = '0.0.0.0';
const NODE_ENV = env.nodeEnv;

async function start() {
  try {
    await connectDB(env.mongodbUri);

    const server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 ${env.appName} started`, {
        port: PORT,
        host: HOST,
        environment: NODE_ENV,
        version: env.appVersion,
        nodeVersion: process.version,
        pid: process.pid,
        timestamp: new Date().toISOString(),
      });
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received, shutting down gracefully`);
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }

      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

start();
