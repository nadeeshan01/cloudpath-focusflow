const express = require('express');
<<<<<<< HEAD
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);
=======

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
>>>>>>> develop

module.exports = router;
