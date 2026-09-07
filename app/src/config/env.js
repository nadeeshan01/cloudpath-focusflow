require("dotenv").config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_NAME || "focusflow-api",
  appVersion: process.env.APP_VERSION || "1.0.0",
  logLevel: process.env.LOG_LEVEL || "info",
  releaseMessage:
    process.env.RELEASE_MESSAGE || "FocusFlow initial release",
};