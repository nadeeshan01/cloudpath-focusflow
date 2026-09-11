const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const logger = require('./utils/logger');

=======
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const rateLimit = require('express-rate-limit');

const env = require('./config/env');
>>>>>>> develop
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const journalRoutes = require('./routes/journal.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
<<<<<<< HEAD
const env = require('./config/env');
=======
const { notFound, errorHandler } = require('./middleware/error.middleware');
>>>>>>> develop

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => (env.nodeEnv || process.env.NODE_ENV) === 'test',
});

<<<<<<< HEAD
// CORS configuration supporting Vite dev server ports
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
    ];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`),
      );
    },
=======
app.use(helmet());

app.use(
  cors({
    origin: env.corsOrigin,
>>>>>>> develop
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));

app.use(morgan('combined'));
app.use('/api/', apiLimiter);

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    console.log(
      JSON.stringify({
        event: 'http_request',
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      })
    );
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

<<<<<<< HEAD
// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
=======
app.use('/api/v1/auth', authRoutes);
>>>>>>> develop
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/journal', journalRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
