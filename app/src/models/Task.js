const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
<<<<<<< HEAD
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
=======
      minlength: 1,
      maxlength: 160,
    },

    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },

>>>>>>> develop
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
    },
<<<<<<< HEAD
=======

>>>>>>> develop
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
<<<<<<< HEAD
=======

>>>>>>> develop
    dueDate: {
      type: Date,
      default: null,
    },
<<<<<<< HEAD
=======

>>>>>>> develop
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
<<<<<<< HEAD
  { timestamps: true }
);

taskSchema.index({ owner: 1, status: 1, createdAt: -1 });
=======
  {
    timestamps: true,
  }
);

taskSchema.index({
  owner: 1,
  status: 1,
  createdAt: -1,
});
>>>>>>> develop

module.exports = mongoose.model('Task', taskSchema);
