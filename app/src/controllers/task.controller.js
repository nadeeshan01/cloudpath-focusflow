const dataStore = require('../utils/dataStore');
const logger = require('../utils/logger');

exports.getTasks = (req, res) => {
  try {
    const tasks = dataStore.getAllTasks();
    logger.info(`Retrieved ${tasks.length} tasks`);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    logger.error('Error fetching tasks', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
};

exports.createTask = (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    // Basic validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const task = dataStore.addTask({
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: 'todo',
      completed: false,
    });

    logger.info('Task created', { taskId: task.id, title: task.title });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    logger.error('Error creating task', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
    });
  }
};
