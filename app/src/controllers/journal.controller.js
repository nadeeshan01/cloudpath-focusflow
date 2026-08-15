const dataStore = require('../utils/dataStore');
const logger = require('../utils/logger');

exports.getJournalEntries = (req, res) => {
  try {
    const entries = dataStore.getAllJournalEntries();
    logger.info(`Retrieved ${entries.length} journal entries`);

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    logger.error('Error fetching journal entries', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch journal entries',
    });
  }
};

exports.createJournalEntry = (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    // Basic validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Journal title is required',
      });
    }

    const entry = dataStore.addJournalEntry({
      title: title.trim(),
      content: content || '',
      mood: mood || 'neutral',
      tags: tags || [],
      entryDate: new Date().toISOString(),
    });

    logger.info('Journal entry created', {
      entryId: entry.id,
      title: entry.title,
    });

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: entry,
    });
  } catch (error) {
    logger.error('Error creating journal entry', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to create journal entry',
    });
  }
};
