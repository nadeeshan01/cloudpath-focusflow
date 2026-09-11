const mongoose = require('mongoose');
const dns = require('dns');
const logger = require('../utils/logger');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  if (process.env.DNS_SERVERS) {
    try {
      dns.setServers(process.env.DNS_SERVERS.split(','));
    } catch {
      // Ignore if setServers fails
    }
  } else {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch {
      // Ignore if setServers is not allowed
    }
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected', {
      host: mongoose.connection.host,
      db: mongoose.connection.name,
    });
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { error: err.message });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  await mongoose.connect(uri);
}

async function disconnectDB() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

module.exports = {
  connectDB,
  connectDatabase: connectDB,
  disconnectDB,
};
