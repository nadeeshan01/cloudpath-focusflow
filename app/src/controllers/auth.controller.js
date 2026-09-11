const User = require('../models/User');
const { signAccessToken } = require('../utils/jwt');
<<<<<<< HEAD
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
=======

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email',
      });
    }

    const existingUser = await User.findOne({ email: { $eq: email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account already exists with this email',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = signAccessToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
>>>>>>> develop
      data: {
        user: user.toSafeObject(),
        token,
      },
    });
  } catch (error) {
<<<<<<< HEAD
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
=======
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email',
      });
    }

    const user = await User.findOne({ email: { $eq: email } }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
>>>>>>> develop
        message: 'Invalid email or password',
      });
    }

<<<<<<< HEAD
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
=======
    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
>>>>>>> develop
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = signAccessToken(user._id.toString());

<<<<<<< HEAD
    logger.info(`User logged in: ${user.email}`);

=======
>>>>>>> develop
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeObject(),
        token,
      },
    });
  } catch (error) {
<<<<<<< HEAD
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
=======
    return next(error);
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user.toSafeObject(),
    },
  });
}

module.exports = {
  register,
  login,
  getCurrentUser,
>>>>>>> develop
};
