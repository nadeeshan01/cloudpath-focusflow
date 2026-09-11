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
    return next(error);
  }
}

module.exports = {
  getDashboardSummary,
};
