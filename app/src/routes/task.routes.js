const express = require('express');
const taskController = require('../controllers/task.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.get('/:taskId', taskController.getTask);
router.patch('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
