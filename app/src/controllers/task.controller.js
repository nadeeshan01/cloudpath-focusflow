<<<<<<< HEAD
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
=======
const mongoose = require('mongoose');
const Task = require('../models/Task');

function isValidTaskId(taskId) {
  return mongoose.Types.ObjectId.isValid(taskId);
}

async function listTasks(req, res, next) {
  try {
    const { status, priority } = req.query;
>>>>>>> develop

    const filter = {
      owner: req.user._id,
    };

    if (typeof status === 'string') {
      filter.status = { $eq: status };
    }

    if (typeof priority === 'string') {
      filter.priority = { $eq: priority };
    }

    const tasks = await Task.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
<<<<<<< HEAD
      data: { tasks, total: tasks.length },
    });
  } catch (error) {
    logger.error('Error fetching tasks', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
=======
      data: {
        tasks,
        total: tasks.length,
      },
    });
  } catch (error) {
    return next(error);
>>>>>>> develop
  }
}

<<<<<<< HEAD
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
=======
async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getTask(req, res, next) {
  try {
    const { taskId } = req.params;

    if (!isValidTaskId(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findOne({
      _id: { $eq: taskId },
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
>>>>>>> develop

    return res.status(200).json({
      success: true,
<<<<<<< HEAD
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
=======
      data: {
        task,
      },
    });
  } catch (error) {
    return next(error);
>>>>>>> develop
  }
}

async function updateTask(req, res, next) {
  try {
    const { taskId } = req.params;

    if (!isValidTaskId(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const { title, description, status, priority, dueDate } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const task = await Task.findOneAndUpdate(
      {
        _id: { $eq: taskId },
        owner: req.user._id,
      },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { taskId } = req.params;

    if (!isValidTaskId(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findOneAndDelete({
      _id: { $eq: taskId },
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
