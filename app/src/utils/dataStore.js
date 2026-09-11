const crypto = require('crypto');

function hashPassword(password) {
  return crypto
    .pbkdf2Sync(password, 'focusflow-salt', 1000, 64, 'sha512')
    .toString('hex');
}

class DataStore {
  constructor() {
    this.users = [];
    this.tasks = [];
    this.journalEntries = [];

    this.userIdCounter = 1;
    this.taskIdCounter = 1;
    this.journalIdCounter = 1;

    // Default demo user for development/tests
    const defaultUser = {
      id: 'user-1',
      _id: 'user-1',
      name: 'Nadeeshan',
      email: 'user@example.com',
      password: hashPassword('password123'),
      createdAt: new Date().toISOString(),
    };
    this.users.push(defaultUser);
  }

  // --- USER METHODS ---
  registerUser({ name, email, password }) {
    const existing = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (existing) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }

    const newUser = {
      id: `user-${this.userIdCounter++}`,
      _id: `user-${this.userIdCounter}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return this.toSafeUser(newUser);
  }

  loginUser({ email, password }) {
    const user = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 400;
      throw error;
    }

    const hashedInput = hashPassword(password);
    if (user.password !== hashedInput) {
      const error = new Error('Invalid email or password');
      error.statusCode = 400;
      throw error;
    }

    return this.toSafeUser(user);
  }

  getUserById(id) {
    const user = this.users.find((u) => u.id === id || u._id === id);
    return user ? this.toSafeUser(user) : null;
  }

  toSafeUser(user) {
    return {
      id: user.id || user._id,
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  // --- TASK METHODS ---
  addTask(task, userId = 'user-1') {
    const newTask = {
      id: this.taskIdCounter++,
      _id: `task-${this.taskIdCounter}`,
      title: task.title ? task.title.trim() : '',
      description: task.description ? task.description.trim() : '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || null,
      completed: task.status === 'done',
      owner: userId,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  getAllTasks(userId = 'user-1') {
    return this.tasks.filter((t) => t.owner === userId || !t.owner);
  }

  getTaskById(taskId, userId = 'user-1') {
    return this.tasks.find(
      (t) =>
        (t.id == taskId || t._id == taskId) && (t.owner === userId || !t.owner)
    );
  }

  updateTask(taskId, updates, userId = 'user-1') {
    const index = this.tasks.findIndex(
      (t) =>
        (t.id == taskId || t._id == taskId) && (t.owner === userId || !t.owner)
    );
    if (index === -1) return null;

    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.tasks[index];
  }

  deleteTask(taskId, userId = 'user-1') {
    const index = this.tasks.findIndex(
      (t) =>
        (t.id == taskId || t._id == taskId) && (t.owner === userId || !t.owner)
    );
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  // --- JOURNAL METHODS ---
  addJournalEntry(entry, userId = 'user-1') {
    const newEntry = {
      id: this.journalIdCounter++,
      _id: `journal-${this.journalIdCounter}`,
      title: entry.title ? entry.title.trim() : '',
      content: entry.content ? entry.content.trim() : '',
      mood: entry.mood || 'neutral',
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      entryDate: entry.entryDate || new Date().toISOString(),
      owner: userId,
      createdAt: new Date().toISOString(),
    };
    this.journalEntries.push(newEntry);
    return newEntry;
  }

  getAllJournalEntries(userId = 'user-1') {
    return this.journalEntries.filter((j) => j.owner === userId || !j.owner);
  }

  getJournalEntryById(entryId, userId = 'user-1') {
    return this.journalEntries.find(
      (j) =>
        (j.id == entryId || j._id == entryId) &&
        (j.owner === userId || !j.owner)
    );
  }

  updateJournalEntry(entryId, updates, userId = 'user-1') {
    const index = this.journalEntries.findIndex(
      (j) =>
        (j.id == entryId || j._id == entryId) &&
        (j.owner === userId || !j.owner)
    );
    if (index === -1) return null;

    this.journalEntries[index] = {
      ...this.journalEntries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.journalEntries[index];
  }

  deleteJournalEntry(entryId, userId = 'user-1') {
    const index = this.journalEntries.findIndex(
      (j) =>
        (j.id == entryId || j._id == entryId) &&
        (j.owner === userId || !j.owner)
    );
    if (index === -1) return false;

    this.journalEntries.splice(index, 1);
    return true;
  }

  // --- DASHBOARD SUMMARY ---
  getDashboardSummary(userId = 'user-1') {
    const userTasks = this.getAllTasks(userId);
    const userJournals = this.getAllJournalEntries(userId);
    const now = new Date();

    const taskCounts = {
      total: userTasks.length,
      todo: userTasks.filter((t) => t.status === 'todo').length,
      inProgress: userTasks.filter((t) => t.status === 'in_progress').length,
      done: userTasks.filter((t) => t.status === 'done').length,
      highPriority: userTasks.filter((t) => t.priority === 'high').length,
      overdue: userTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
      ).length,
    };

    const recentTasks = [...userTasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const recentJournalEntries = [...userJournals]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      taskCounts,
      journalCount: userJournals.length,
      recentTasks,
      recentJournalEntries,
    };
  }
}

module.exports = new DataStore();
