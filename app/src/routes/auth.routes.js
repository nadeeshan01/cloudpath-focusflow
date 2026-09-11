const express = require('express');

const {
  register,
  login,
  getCurrentUser,
} = require('../controllers/auth.controller');

const validate = require('../middleware/validate.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

const { registerSchema, loginSchema } = require('../utils/authValidation');

const router = express.Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.get('/me', requireAuth, getCurrentUser);

module.exports = router;
