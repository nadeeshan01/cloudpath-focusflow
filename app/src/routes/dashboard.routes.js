const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/summary', requireAuth, dashboardController.getDashboardSummary);

module.exports = router;
