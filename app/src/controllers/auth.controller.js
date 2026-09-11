const User = require('../models/User');
const { signAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: { $eq: cleanEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({ name, email: cleanEmail, password });
    const token = signAccessToken(user._id.toString());

    logger.info(`User registered: ${user.email}`);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.toSafeObject(),
        token,
      },
    });
  } catch (error) {
    logger.error('Registration failed', { error: error.message });

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: { $eq: cleanEmail } }).select(
      '+password'
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = signAccessToken(user._id.toString());

    logger.info(`User logged in: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeObject(),
        token,
      },
    });
  } catch (error) {
    logger.error('Login failed', { error: error.message });
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
}

async function getCurrentUser(req, res) {
  const safeUser =
    req.user && typeof req.user.toSafeObject === 'function'
      ? req.user.toSafeObject()
      : req.user;
  return res.status(200).json({
    success: true,
    data: {
      user: safeUser,
    },
  });
}

const getMe = getCurrentUser;

module.exports = {
  register,
  login,
  getCurrentUser,
  getMe,
};
