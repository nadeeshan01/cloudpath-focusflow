const express = require('express');

const {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

const { requireAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
  createTaskSchema,
  updateTaskSchema,
} = require('../utils/taskValidation');

const router = express.Router();

router.use(requireAuth);

router.get('/', listTasks);

router.post('/', validate(createTaskSchema), createTask);

router.get('/:taskId', getTask);

router.patch('/:taskId', validate(updateTaskSchema), updateTask);

router.delete('/:taskId', deleteTask);

module.exports = router;
