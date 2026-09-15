const winston = require('winston');

const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, stack, error, ...meta }) => {
    let log = `${timestamp ? `[${timestamp}] ` : ''}${level}: ${message}`;

    const errDetail =
      stack ||
      (error && error.stack) ||
      (error && error.message) ||
      (error ? String(error) : '');

    if (errDetail && !message.includes(errDetail)) {
      log += `\n  ${errDetail}`;
    }

    const metaKeys = Object.keys(meta).filter(
      (k) => !['service', 'version', 'splat'].includes(k)
    );
    if (metaKeys.length > 0) {
      const cleanMeta = {};
      metaKeys.forEach((k) => {
        cleanMeta[k] = meta[k];
      });
      log += `\n  Meta: ${JSON.stringify(cleanMeta, null, 2)}`;
    }

    return log;
  }
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.APP_NAME || 'focusflow-api',
    version: process.env.APP_VERSION || '0.1.0',
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), consoleFormat),
    }),
  ],
});

module.exports = logger;
