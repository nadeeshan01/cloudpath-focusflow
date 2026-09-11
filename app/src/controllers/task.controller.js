const mongoose = require('mongoose');
const Task = require('../models/Task');

function isValidTaskId(taskId) {
  return mongoose.Types.ObjectId.isValid(taskId);
}

async function listTasks(req, res, next) {
  try {
    const { status, priority } = req.query;

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
    const task = await Task.create({
      ...req.body,
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
    const { taskId } = req.params;

    if (!isValidTaskId(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: { $eq: taskId },
        owner: req.user._id,
      },
      req.body,
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
