const mongoose = require('mongoose');
const Task = require('../models/Task');
const JournalEntry = require('../models/JournalEntry');
const logger = require('../utils/logger');

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Authentication required' });
    }

    const ownerId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const now = new Date();

    const [
      statusCounts,
      highPriority,
      overdue,
      journalCount,
      recentTasks,
      recentJournalEntries,
    ] = await Promise.all([
      Task.aggregate([
        { $match: { owner: ownerId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.countDocuments({ owner: ownerId, priority: 'high' }),
      Task.countDocuments({
        owner: ownerId,
        dueDate: { $lt: now },
        status: { $ne: 'done' },
      }),
      JournalEntry.countDocuments({ owner: ownerId }),
      Task.find({ owner: ownerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status priority dueDate createdAt'),
      JournalEntry.find({ owner: ownerId })
        .sort({ entryDate: -1, createdAt: -1 })
        .limit(5)
        .select('title mood tags entryDate createdAt'),
    ]);

    const taskCounts = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      highPriority,
      overdue,
    };
    for (const item of statusCounts) {
      taskCounts.total += item.count;
      if (item._id === 'todo') taskCounts.todo = item.count;
      if (item._id === 'in_progress') taskCounts.inProgress = item.count;
      if (item._id === 'done') taskCounts.done = item.count;
    }

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
    logger.error('Error getting dashboard summary', { error: error.message });
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard summary',
    });
  }
};
