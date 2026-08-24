# 🚀 CloudPath FocusFlow

> **DevSecOps Containerized Task & Journal API Platform**  
> *CCA DevOps Engineer Internship Project*

---

## 📌 Project Overview

**CloudPath FocusFlow** (`focusflow-api`) is a production-grade, containerized RESTful API service built for managing Tasks and Journal entries. Designed with modern **DevSecOps** practices, it demonstrates a complete workflow from backend development, automated unit/integration testing, multi-stage Docker containerization, security hardening, vulnerability scanning with **Trivy**, to developer productivity automation using **Makefile** and **Docker Compose**.

---

## 🛠️ Technology Stack & Tools Used

### **Backend Core**
* **Runtime:** Node.js (v22 / v24 LTS)
* **Framework:** Express.js (v5)
* **Architecture:** Modular MVC / Controller-Service pattern with CommonJS modules

### **Security & Quality Engineering**
* **HTTP Hardening:** [Helmet](https://helmetjs.github.io/) (HTTP security headers mitigation)
* **CORS Management:** Configurable origin restriction (`ALLOWED_ORIGINS`)
* **Logging:** [Winston](https://github.com/winstonjs/winston) (Structured JSON logger with IP and User-Agent metadata)
* **Linting & Formatting:** ESLint (v10 Flat Config) + Prettier

### **Testing Framework**
* **Unit & Integration Testing:** [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest)
* **Code Coverage:** Integrated Jest coverage report generation

### **DevOps, Containerization & Security Scanning**
* **Containerization:** Docker (Multi-stage builds targeting Alpine Linux)
* **Orchestration:** Docker Compose (`compose.yaml` for production, `compose.dev.yaml` for live dev)
* **Security Scanner:** [Trivy](https://trivy.dev/) (Container vulnerability & secret scanning)
* **Automation:** GNU Makefile for standardized build, test, run, and scan pipelines

---

## 🔐 DevSecOps & Security Hardening Highlights

1. **Multi-Stage Dockerfile Optimization:**
   * Stage 1 (`dependencies`): Installs production dependencies only (`npm ci --omit=dev`) and cleans cache.
   * Stage 2 (`runtime`): Copies built dependencies into a lightweight `node:22-alpine` base image.
2. **Non-Root Execution:**
   * Executes as an unprivileged system user (`appuser:appgroup`) instead of `root`.
3. **Container Hardening Parameters:**
   * `read_only: true` (Read-only root filesystem)
   * `tmpfs: /tmp` (Ephemeral in-memory writable space for temp files)
   * `security_opt: no-new-privileges:true` (Prevents privilege escalation)
4. **Active Container Healthchecks:**
   * Native HTTP `/health` probe integrated into both Dockerfile and Docker Compose.
5. **Vulnerability Scanning Pipeline:**
   * Automated scan recipes via Trivy supporting JSON report generation (`evidence/week-02/09-trivy-scan.json`) and CI/CD fail-on-severity flags (`--exit-code 1`).

---

## 📁 Project Directory Structure

```text
cloudpath-focusflow/
├── app/
│   ├── src/
│   │   ├── config/          # Environment & app configuration
│   │   ├── controllers/     # Route logic handlers (Task & Journal)
│   │   ├── middleware/      # Security, logging, and error handling
│   │   ├── routes/          # Express API endpoints
│   │   ├── services/        # Business logic & in-memory data store
│   │   ├── utils/           # Winston logger utility
│   │   ├── app.js           # Express app initialization
│   │   └── server.js        # Server bootstrap
│   ├── tests/               # Jest & Supertest integration tests
│   ├── .dockerignore        # Docker build context exclusions
│   ├── .env.example         # Sample environment variables
│   ├── Dockerfile           # Multi-stage production Docker image
│   ├── Dockerfile.dev       # Development Docker image with live reload
│   ├── eslint.config.js     # ESLint configuration
│   └── package.json         # Dependencies & npm scripts
├── docs/
│   ├── architecture.md      # Architecture diagram & design specs
│   └── week-01-plan.md      # Sprint plan documentation
├── evidence/
│   ├── week-01/             # Week 1 submission artifacts
│   └── week-02/             # Week 2 Trivy scan JSON & tool versions
├── compose.yaml             # Hardened production Docker Compose spec
├── compose.dev.yaml         # Development Docker Compose spec
├── Makefile                 # Automation task runner
└── README.md                # Project documentation
```

---

## 🌐 API Endpoints Overview

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status, environment, version, and timestamp |
| `GET` | `/api/v1/version` | Detailed API & Node runtime version information |
| `GET` | `/api/v1/tasks` | Fetch all tasks |
| `POST` | `/api/v1/tasks` | Create a new task (title, description, priority, status) |
| `GET` | `/api/v1/tasks/:id` | Fetch specific task by ID |
| `PUT` | `/api/v1/tasks/:id` | Update an existing task |
| `DELETE`| `/api/v1/tasks/:id` | Delete a task |
| `GET` | `/api/v1/journal` | Fetch all journal entries |
| `POST` | `/api/v1/journal` | Create a new journal entry |

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js** (v18+) & **npm** (v9+)
* **Docker** & **Docker Compose**
* **Trivy** (for vulnerability scanning)
* **Make** (GNU Make)

---

### 1️⃣ Local Development Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cloudpath-focusflow.git
cd cloudpath-focusflow

# Setup environment configuration
cp app/.env.example app/.env

# Run local development with Docker Live Reload
make dev
```
*The API will be available at `http://localhost:5000`.*

---

### 2️⃣ Running Unit & Integration Tests

```bash
# Run Jest test suite with code coverage
make test
```

---

### 3️⃣ Building & Running Production Container

```bash
# Build production Docker image (focusflow-api:0.1.0)
make build

# Start production service using Docker Compose
make up

# Check container health status
make health

# View logs
make logs

# Stop container
make down
```

---

### 4️⃣ Security Scanning with Trivy

```bash
# Run scan for HIGH and CRITICAL vulnerabilities
make scan

# Run full vulnerability scan across all severities
make scan-full

# Export Trivy scan report to JSON format (evidence/week-02/09-trivy-scan.json)
make scan-json

# Run CI/CD build break check (exits with code 1 if HIGH/CRITICAL found)
make scan-ci
```

---

## 📋 Makefile Reference

| Target | Command | Description |
| :--- | :--- | :--- |
| `make help` | `make help` | Displays list of all available Makefile targets |
| `make dev` | `docker compose -f compose.dev.yaml up --build` | Starts development container with live volume mounts |
| `make build` | `docker build --pull -t focusflow-api:0.1.0 ./app` | Builds the production multi-stage Docker image |
| `make up` | `docker compose up -d --build` | Launches production container stack in detached mode |
| `make down` | `docker compose down` | Stops and removes running containers |
| `make health` | `curl -s http://localhost:5000/health \| jq` | Checks application health endpoint |
| `make test` | `cd app && npm test` | Runs Jest unit tests and generates coverage metrics |
| `make scan` | `trivy image --severity HIGH,CRITICAL ...` | Scans image for High/Critical vulnerabilities |
| `make scan-full` | `trivy image focusflow-api:0.1.0` | Runs full Trivy vulnerability scan |
| `make scan-json` | `trivy image --format json -o ...` | Generates structured JSON scan report |
| `make scan-ci` | `trivy image --exit-code 1 ...` | Enforces CI pipeline security gate |
| `make clean` | `docker compose down --rmi local --volumes` | Clean up containers, images, and volumes |

---

## 👤 Author & License

* **Author:** Kavindu Nadeeshan
* **License:** [MIT](LICENSE)