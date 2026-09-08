const Task = require('../models/Task');
const logger = require('../utils/logger');

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const filter = { owner: userId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    logger.info(`Retrieved ${tasks.length} tasks`);

    res.status(200).json({
      success: true,
      data: { tasks, total: tasks.length },
    });
  } catch (error) {
    logger.error('Error fetching tasks', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { title, description, priority, dueDate, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: status || 'todo',
      owner: userId,
    });

    logger.info('Task created', { taskId: task._id, title: task.title });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    logger.error('Error creating task', { error: error.message });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};

exports.getTask = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({ success: true, data: { task } });
  } catch (error) {
    logger.error('Error fetching task', { error: error.message });
    return res.status(500).json({ success: false, message: 'Failed to fetch task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { taskId } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: taskId, owner: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    logger.error('Error updating task', { error: error.message });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    return res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { taskId } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskId, owner: userId });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting task', { error: error.message });
    return res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};
