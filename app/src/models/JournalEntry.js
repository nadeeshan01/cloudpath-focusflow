const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Journal title is required'],
      trim: true,
      minlength: 1,
      maxlength: 160,
    },

    content: {
      type: String,
      required: [true, 'Journal content is required'],
      trim: true,
      minlength: 1,
      maxlength: 10000,
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
        validator(tags) {
          return tags.length <= 10;
        },
        message: 'A journal entry can contain at most 10 tags',
      },
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

journalEntrySchema.index({
  owner: 1,
  entryDate: -1,
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
