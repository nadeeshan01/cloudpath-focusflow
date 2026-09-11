const mongoose = require('mongoose');
const Task = require('../models/Task');
const logger = require('../utils/logger');

function isValidTaskId(taskId) {
  return mongoose.Types.ObjectId.isValid(taskId);
}

async function listTasks(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { status, priority } = req.query;
    const filter = {
      owner: userId,
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

    if (logger?.info) {
      logger.info(`Retrieved ${tasks.length} tasks`);
    }

    return res.status(200).json({
      success: true,
      data: {
        tasks,
        total: tasks.length,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      owner: userId,
    });

    if (logger?.info) {
      logger.info('Task created', { taskId: task._id, title: task.title });
    }

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
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { taskId } = req.params;

    if (!isValidTaskId(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findOne({
      _id: { $eq: taskId },
      owner: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { taskId } = req.params;

    if (!isValidTaskId(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const { title, description, status, priority, dueDate } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const task = await Task.findOneAndUpdate(
      {
        _id: { $eq: taskId },
        owner: userId,
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
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { taskId } = req.params;

    if (!isValidTaskId(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findOneAndDelete({
      _id: { $eq: taskId },
      owner: userId,
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
  getTasks: listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};