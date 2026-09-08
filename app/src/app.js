const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const journalRoutes = require('./routes/journal.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(morgan('combined'));

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

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/journal', journalRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
