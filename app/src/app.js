const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./utils/logger');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const journalRoutes = require('./routes/journal.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const env = require('./config/env');

const app = express();

// Security middleware
app.use(helmet());

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
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: process.env.APP_NAME || 'focusflow-api',
    version: process.env.APP_VERSION || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Version endpoint
app.get('/api/v1/version', (req, res) => {
  res.json({
    success: true,
    data: {
      service: env.appName,
      version: env.appVersion,
      environment: env.nodeEnv,
      releaseMessage: env.releaseMessage,
      apiVersion: 'v1',
    },
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/journal', journalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, _next) => {
  logger.error('Application error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

module.exports = app;
