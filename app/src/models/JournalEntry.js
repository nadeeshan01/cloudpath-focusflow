const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Journal title is required'],
      trim: true,
<<<<<<< HEAD
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
=======
      minlength: 1,
      maxlength: 160,
    },

>>>>>>> develop
    content: {
      type: String,
      required: [true, 'Journal content is required'],
      trim: true,
<<<<<<< HEAD
      minlength: [1, 'Content must be at least 1 character'],
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
=======
      minlength: 1,
      maxlength: 10000,
    },

>>>>>>> develop
    mood: {
      type: String,
      enum: ['great', 'good', 'neutral', 'bad'],
      default: 'neutral',
    },
<<<<<<< HEAD
=======

>>>>>>> develop
    entryDate: {
      type: Date,
      default: Date.now,
    },
<<<<<<< HEAD
=======

>>>>>>> develop
    tags: {
      type: [String],
      default: [],
      validate: {
<<<<<<< HEAD
        validator: (v) => v.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
=======
        validator(tags) {
          return tags.length <= 10;
        },
        message: 'A journal entry can contain at most 10 tags',
      },
    },

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

journalEntrySchema.index({ owner: 1, entryDate: -1 });
=======
  {
    timestamps: true,
  }
);

journalEntrySchema.index({
  owner: 1,
  entryDate: -1,
});
>>>>>>> develop

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
