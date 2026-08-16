# Week 01 Plan

## API Documentation

http://localhost:5000/api/v1

# Endpoints

# List tasks
GET /api/v1/tasks

# Create task
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Setup pipeline",
  "description": "Configure GitHub Actions",
  "priority": "high"
}

# List entries
GET /api/v1/journal

# Create entry
POST /api/v1/journal
Content-Type: application/json

{
  "title": "Week 1 Complete",
  "content": "Successfully built API foundation",
  "mood": "productive",
  "tags": ["devops", "learning"]
}

cloudpath-focusflow/
├── app/
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities
│   │   ├── app.js           # Express app
│   │   └── server.js        # Server entry
│   ├── tests/               # Jest tests
│   ├── package.json
│   └── .env.example
├── docs/
│   └── architecture.md
├── evidence/
│   └── week-01/
└── README.md

Development Commands

# Start server
npm start

# Development with auto-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

Current Features

✅ RESTful API with Express.js
✅ Structured JSON logging
✅ Health and version endpoints
✅ Task CRUD operations
✅ Journal entry management
✅ Input validation
✅ Error handling
✅ Automated testing
✅ Code linting & formatting

Testing

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage

🔐 Security

✅ No secrets in repository
✅ Environment-based configuration
✅ Helmet.js security headers
✅ CORS protection
✅ Input validation
✅ Error message sanitization


4. **Create Week 1 Evidence Document (evidence/week-01/README.md)**

```markdown
# Week 1 Evidence

## Checkpoint: API Foundation Complete ✅

### Completed Tasks

1. ✅ GitHub repository created
2. ✅ Branch structure (main, develop, feature)
3. ✅ Express API foundation
4. ✅ Health & version endpoints
5. ✅ Task endpoints (list, create)
6. ✅ Journal endpoints (list, create)
7. ✅ Structured logging
8. ✅ Automated tests
9. ✅ Code quality tools
10. ✅ Comprehensive documentation

### Screenshots

#### 1. Repository Structure
![Repository]()

#### 2. Branch List
![Branches](./screenshots/02-branches.png)

#### 3. Health Endpoint
![Health](./screenshots/03-health.png)

#### 4. Task Endpoints
![Tasks](./screenshots/04-tasks.png)

#### 5. Journal Endpoints
![Journal](./screenshots/05-journal.png)

#### 6. Test Results
![Tests](./screenshots/06-tests.png)

#### 7. Coverage Report
![Coverage](./screenshots/07-coverage.png)

#### 8. Structured Logs
![Logs](./screenshots/08-logs.png)

### Git Commit History

```bash
git log --oneline --graph --all