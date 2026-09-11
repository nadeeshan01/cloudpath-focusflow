<<<<<<< HEAD
const mongoose = require('mongoose');
const Task = require('../models/Task');
const JournalEntry = require('../models/JournalEntry');
const logger = require('../utils/logger');

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const ownerId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const now = new Date();

    const [statusCounts, highPriority, overdue, journalCount, recentTasks, recentJournalEntries] =
      await Promise.all([
        Task.aggregate([
          { $match: { owner: ownerId } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Task.countDocuments({ owner: userId, priority: 'high' }),
        Task.countDocuments({ owner: userId, dueDate: { $lt: now }, status: { $ne: 'done' } }),
        JournalEntry.countDocuments({ owner: userId }),
        Task.find({ owner: userId })
          .select('title status priority dueDate createdAt')
          .sort({ createdAt: -1 })
          .limit(5),
        JournalEntry.find({ owner: userId })
          .select('title mood tags entryDate createdAt')
          .sort({ entryDate: -1, createdAt: -1 })
          .limit(5),
      ]);

    const taskCounts = { total: 0, todo: 0, inProgress: 0, done: 0, highPriority, overdue };
    for (const item of statusCounts) {
      taskCounts.total += item.count;
      if (item._id === 'todo') taskCounts.todo = item.count;
      if (item._id === 'in_progress') taskCounts.inProgress = item.count;
      if (item._id === 'done') taskCounts.done = item.count;
    }
=======
const Task = require('../models/Task');
const JournalEntry = require('../models/JournalEntry');

async function getDashboardSummary(req, res, next) {
  try {
    const owner = req.user._id;
    const now = new Date();

    const [
      taskStatusCounts,
      highPriorityCount,
      overdueCount,
      journalCount,
      recentTasks,
      recentJournalEntries,
    ] = await Promise.all([
      Task.aggregate([
        {
          $match: {
            owner,
          },
        },
        {
          $group: {
            _id: '$status',
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      Task.countDocuments({
        owner,
        priority: 'high',
      }),

      Task.countDocuments({
        owner,
        dueDate: {
          $lt: now,
        },
        status: {
          $ne: 'done',
        },
      }),

      JournalEntry.countDocuments({
        owner,
      }),

      Task.find({
        owner,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select('title status priority dueDate createdAt'),

      JournalEntry.find({
        owner,
      })
        .sort({
          entryDate: -1,
          createdAt: -1,
        })
        .limit(5)
        .select('title mood tags entryDate createdAt'),
    ]);

    const taskCounts = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      highPriority: highPriorityCount,
      overdue: overdueCount,
    };

    taskStatusCounts.forEach((item) => {
      taskCounts.total += item.count;

      if (item._id === 'todo') {
        taskCounts.todo = item.count;
      }

      if (item._id === 'in_progress') {
        taskCounts.inProgress = item.count;
      }

      if (item._id === 'done') {
        taskCounts.done = item.count;
      }
    });
>>>>>>> develop

    return res.status(200).json({
      success: true,
      data: {
        taskCounts,
        journalCount,
        recentTasks,
        recentJournalEntries,
      },
    });
  } catch (error) {
<<<<<<< HEAD
    logger.error('Error getting dashboard summary', { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard summary',
    });
  }
=======
    return next(error);
  }
}

module.exports = {
  getDashboardSummary,
>>>>>>> develop
};
