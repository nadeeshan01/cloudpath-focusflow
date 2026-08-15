// Simple in-memory data store for Week 1
class DataStore {
  constructor() {
    this.tasks = [];
    this.journalEntries = [];
    this.taskIdCounter = 1;
    this.journalIdCounter = 1;
  }

  // Task methods
  addTask(task) {
    const newTask = {
      id: this.taskIdCounter++,
      ...task,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return newTask;
  }

  getAllTasks() {
    return this.tasks;
  }

  // Journal methods
  addJournalEntry(entry) {
    const newEntry = {
      id: this.journalIdCounter++,
      ...entry,
      createdAt: new Date().toISOString()
    };
    this.journalEntries.push(newEntry);
    return newEntry;
  }

  getAllJournalEntries() {
    return this.journalEntries;
  }
}

module.exports = new DataStore();