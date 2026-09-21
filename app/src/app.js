const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const journalRoutes = require('./routes/journal.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => (env.nodeEnv || process.env.NODE_ENV) === 'test',
});

// Production & local dev CORS origins
const fallbackOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
];

const allowedOrigins =
  Array.isArray(env.corsOrigins) && env.corsOrigins.length > 0
    ? env.corsOrigins
    : fallbackOrigins;

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));
app.use('/api/', apiLimiter);

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    logger.info('http_request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
});

app.get('/health', (req, res) => {
  const isTest = (env.nodeEnv || process.env.NODE_ENV) === 'test';
  const databaseConnected = mongoose.connection.readyState === 1 || isTest;

  return res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'degraded',
    service: env.appName,
    version: env.appVersion,
    database: databaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/version', (req, res) => {
  return res.json({
    success: true,
    data: {
      service: env.appName,
      version: env.appVersion,
      apiVersion: 'v1',
      environment: env.nodeEnv,
    },
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/journal', journalRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
