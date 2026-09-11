const mongoose = require('mongoose');
const JournalEntry = require('../models/JournalEntry');

function isValidJournalId(entryId) {
  return mongoose.Types.ObjectId.isValid(entryId);
}

async function listJournalEntries(req, res, next) {
  try {
    const { mood, tag } = req.query;

    const filter = {
      owner: req.user._id,
    };

    if (typeof mood === 'string') {
      filter.mood = { $eq: mood };
    }

    if (typeof tag === 'string') {
      filter.tags = { $eq: tag.toLowerCase() };
    }

    const entries = await JournalEntry.find(filter).sort({
      entryDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: {
        entries,
        total: entries.length,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function createJournalEntry(req, res, next) {
  try {
    const { title, content, mood, tags, entryDate } = req.body;

    const entry = await JournalEntry.create({
      title,
      content,
      mood,
      tags,
      entryDate,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: {
        entry,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getJournalEntry(req, res, next) {
  try {
    const { entryId } = req.params;

    if (!isValidJournalId(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid journal entry ID',
      });
    }

    const entry = await JournalEntry.findOne({
      _id: { $eq: entryId },
      owner: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        entry,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateJournalEntry(req, res, next) {
  try {
    const { entryId } = req.params;

    if (!isValidJournalId(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid journal entry ID',
      });
    }

    const { title, content, mood, tags, entryDate } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (mood !== undefined) updateData.mood = mood;
    if (tags !== undefined) updateData.tags = tags;
    if (entryDate !== undefined) updateData.entryDate = entryDate;

    const entry = await JournalEntry.findOneAndUpdate(
      {
        _id: { $eq: entryId },
        owner: req.user._id,
      },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      data: {
        entry,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteJournalEntry(req, res, next) {
  try {
    const { entryId } = req.params;

    if (!isValidJournalId(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid journal entry ID',
      });
    }

    const entry = await JournalEntry.findOneAndDelete({
      _id: { $eq: entryId },
      owner: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listJournalEntries,
  createJournalEntry,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
};
