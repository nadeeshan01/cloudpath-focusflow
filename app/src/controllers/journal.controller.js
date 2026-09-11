const mongoose = require('mongoose');
const JournalEntry = require('../models/JournalEntry');
const logger = require('../utils/logger');

function isValidJournalId(entryId) {
  return mongoose.Types.ObjectId.isValid(entryId);
}

async function listJournalEntries(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { mood, tag } = req.query;
    const filter = {
      owner: userId,
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

    if (logger?.info) {
      logger.info(`Retrieved ${entries.length} journal entries`);
    }

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
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { title, content, mood, tags, entryDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Journal title is required' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Journal content is required' });
    }

    const entry = await JournalEntry.create({
      title: title.trim(),
      content: content.trim(),
      mood: mood || 'neutral',
      tags: Array.isArray(tags) ? tags : [],
      entryDate: entryDate || new Date(),
      owner: userId,
    });

    if (logger?.info) {
      logger.info('Journal entry created', { entryId: entry._id, title: entry.title });
    }

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
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { entryId } = req.params;

    if (!isValidJournalId(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid journal entry ID',
      });
    }

    const entry = await JournalEntry.findOne({
      _id: { $eq: entryId },
      owner: userId,
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
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { entryId } = req.params;

    if (!isValidJournalId(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid journal entry ID',
      });
    }

    const { title, content, mood, tags, entryDate } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (mood !== undefined) updateData.mood = mood;
    if (tags !== undefined) updateData.tags = tags;
    if (entryDate !== undefined) updateData.entryDate = entryDate;

    const entry = await JournalEntry.findOneAndUpdate(
      {
        _id: { $eq: entryId },
        owner: userId,
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
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { entryId } = req.params;

    if (!isValidJournalId(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid journal entry ID',
      });
    }

    const entry = await JournalEntry.findOneAndDelete({
      _id: { $eq: entryId },
      owner: userId,
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
  getJournalEntries: listJournalEntries,
  createJournalEntry,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
};