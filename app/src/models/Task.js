const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: 1,
      maxlength: 160,
    },

    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    dueDate: {
      type: Date,
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({
  owner: 1,
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model('Task', taskSchema);
