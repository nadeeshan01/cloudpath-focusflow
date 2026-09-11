const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Journal title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    content: {
      type: String,
      required: [true, 'Journal content is required'],
      trim: true,
      minlength: [1, 'Content must be at least 1 character'],
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'neutral', 'bad'],
      default: 'neutral',
    },
    entryDate: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

journalEntrySchema.index({ owner: 1, entryDate: -1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
