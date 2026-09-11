const express = require('express');
<<<<<<< HEAD
const taskController = require('../controllers/task.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.get('/:taskId', taskController.getTask);
router.patch('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);
=======

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
>>>>>>> develop

module.exports = router;
