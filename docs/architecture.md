# FocusFlow API Architecture

## Overview
FocusFlow is a DevSecOps deployment platform showcasing a Task and Journal API with complete CI/CD pipeline.

## Architecture Diagram

┌─────────────┐
│ Client      │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Express API         │
│ ┌───────────────┐   │
│ │ Health        │   │
│ │ Tasks         │   │
│ │ Journal       │   │
│ └───────────────┘   │
└──────────┬───────────┘
           │
           ▼
    ┌──────────┐
    │ In-Memory│
    │ Store    │
    └──────────┘


## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Logging:** Winston
- **Testing:** Jest + Supertest
- **Code Quality:** ESLint + Prettier

### DevOps (Planned)
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Orchestration:** Kubernetes (Kind/Minikube)
- **IaC:** Terraform
- **Monitoring:** Prometheus + Grafana (optional)

## API Endpoints

### Health & Info
- `GET /health` - Health check
- `GET /api/v1/version` - API version

### Tasks
- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task

### Journal
- `GET /api/v1/journal` - List entries
- `POST /api/v1/journal` - Create entry

## Data Models

### Task
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "priority": "low|medium|high",
  "status": "todo|in_progress|done",
  "dueDate": "ISO8601",
  "completed": false,
  "createdAt": "ISO8601"
}