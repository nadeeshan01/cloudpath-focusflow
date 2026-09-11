const express = require('express');

const { getDashboardSummary } = require('../controllers/dashboard.controller');

const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/summary', getDashboardSummary);

module.exports = router;
