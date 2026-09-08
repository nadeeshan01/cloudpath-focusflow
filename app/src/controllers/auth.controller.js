const User = require('../models/User');
const { signAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({ name, email, password });
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

    return res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
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
    return res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

exports.getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};
