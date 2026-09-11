const express = require('express');
<<<<<<< HEAD
const dashboardController = require('../controllers/dashboard.controller');
=======

const { getDashboardSummary } = require('../controllers/dashboard.controller');

>>>>>>> develop
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

<<<<<<< HEAD
router.get('/summary', requireAuth, dashboardController.getDashboardSummary);
=======
router.use(requireAuth);

router.get('/summary', getDashboardSummary);
>>>>>>> develop

module.exports = router;
