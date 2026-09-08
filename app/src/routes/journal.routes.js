const express = require('express');
const journalController = require('../controllers/journal.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', journalController.getJournalEntries);
router.post('/', journalController.createJournalEntry);
router.get('/:entryId', journalController.getJournalEntry);
router.patch('/:entryId', journalController.updateJournalEntry);
router.delete('/:entryId', journalController.deleteJournalEntry);

module.exports = router;
