const JournalEntry = require('../models/JournalEntry');
const logger = require('../utils/logger');

exports.getJournalEntries = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const filter = { owner: userId };
    if (req.query.mood) filter.mood = req.query.mood;
    if (req.query.tag) filter.tags = req.query.tag.toLowerCase();

    const entries = await JournalEntry.find(filter).sort({ entryDate: -1, createdAt: -1 });
    logger.info(`Retrieved ${entries.length} journal entries`);

    res.status(200).json({
      success: true,
      data: { entries, total: entries.length },
    });
  } catch (error) {
    logger.error('Error fetching journal entries', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch journal entries' });
  }
};

exports.createJournalEntry = async (req, res) => {
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

    logger.info('Journal entry created', { entryId: entry._id, title: entry.title });

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: { entry },
    });
  } catch (error) {
    logger.error('Error creating journal entry', { error: error.message });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Failed to create journal entry' });
  }
};

exports.getJournalEntry = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { entryId } = req.params;
    const entry = await JournalEntry.findOne({ _id: entryId, owner: userId });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    return res.status(200).json({ success: true, data: { entry } });
  } catch (error) {
    logger.error('Error fetching journal entry', { error: error.message });
    return res.status(500).json({ success: false, message: 'Failed to fetch journal entry' });
  }
};

exports.updateJournalEntry = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { entryId } = req.params;
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: entryId, owner: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      data: { entry },
    });
  } catch (error) {
    logger.error('Error updating journal entry', { error: error.message });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    return res.status(500).json({ success: false, message: 'Failed to update journal entry' });
  }
};

exports.deleteJournalEntry = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { entryId } = req.params;
    const entry = await JournalEntry.findOneAndDelete({ _id: entryId, owner: userId });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting journal entry', { error: error.message });
    return res.status(500).json({ success: false, message: 'Failed to delete journal entry' });
  }
};
