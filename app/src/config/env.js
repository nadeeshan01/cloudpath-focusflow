require('dotenv').config();

function getEnvOrDefault(name, defaultValue) {
  const value = process.env[name];
  if (value) return value;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return defaultValue;
}

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'focusflow-api',
  appVersion: process.env.APP_VERSION || '1.0.0',
  logLevel: process.env.LOG_LEVEL || 'info',

  mongodbUri: getEnvOrDefault(
    'MONGODB_URI',
    'mongodb://127.0.0.1:27017/focusflow_test'
  ),

  jwtSecret: getEnvOrDefault(
    'JWT_SECRET',
    'test_jwt_secret_key_focusflow_12345'
  ),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
