const express = require('express');
<<<<<<< HEAD
const journalController = require('../controllers/journal.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', journalController.getJournalEntries);
router.post('/', journalController.createJournalEntry);
router.get('/:entryId', journalController.getJournalEntry);
router.patch('/:entryId', journalController.updateJournalEntry);
router.delete('/:entryId', journalController.deleteJournalEntry);
=======

const {
  listJournalEntries,
  createJournalEntry,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} = require('../controllers/journal.controller');

const { requireAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
  createJournalSchema,
  updateJournalSchema,
} = require('../utils/journalValidation');

const router = express.Router();

router.use(requireAuth);

router.get('/', listJournalEntries);

router.post('/', validate(createJournalSchema), createJournalEntry);

router.get('/:entryId', getJournalEntry);

router.patch('/:entryId', validate(updateJournalSchema), updateJournalEntry);

router.delete('/:entryId', deleteJournalEntry);
>>>>>>> develop

module.exports = router;
