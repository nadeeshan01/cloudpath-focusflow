# 🚀 CloudPath FocusFlow

> **DevSecOps Containerized Task & Journal Full-Stack Platform**  
> *CCA DevOps Engineer Internship Project*

---

## 📌 Project Overview

**CloudPath FocusFlow** is a production-grade, containerized full-stack task and journal management application. It features a modern **React SPA frontend** built with **Vite 7** served via a hardened **Nginx reverse proxy**, and a robust **Express RESTful API** backend connected to **MongoDB Atlas**.

Designed with modern **DevSecOps** principles, FocusFlow demonstrates complete end-to-end containerization, multi-stage Docker builds, non-root container isolation, strict resource & log rotation governance, security vulnerability remediation, and automated orchestration using **Docker Compose** and **GNU Makefile**.

---

## 🏗️ Architecture Overview

```text
Browser (Port 3000)
  ↓
Nginx React Frontend Container (focusflow-web : 8080)
  ↓ /api/v1 (Internal Reverse Proxy)
Express API Container (focusflow-api : 5000)
  ↓
MongoDB Atlas Cluster
```

---

## 📱 1. Frontend Architecture & Technologies

* **Core Framework:** React 19 + React Router v7
* **Build System:** Vite 7 (High-performance ES module bundler with instant HMR)
* **HTTP Client:** Axios (Configured for `/api/v1` base proxy requests)
* **Web Server & Reverse Proxy:** Nginx 1.27 (Alpine base image)
* **SPA Routing:** Nginx fallback handling (`try_files $uri $uri/ /index.html`)
* **Internal Proxying:** Nginx location routing for `/api/` pointing to backend `http://api:5000`
* **Performance Optimization:** Gzip compression enabled for JS, CSS, JSON, SVG; long-term immutable asset caching (`expires 1y`) for `/assets/`
* **Nginx Security Headers:**
  * `X-Frame-Options "SAMEORIGIN"`
  * `X-Content-Type-Options "nosniff"`
  * `Referrer-Policy "strict-origin-when-cross-origin"`
  * `X-XSS-Protection "1; mode=block"`

---

## ⚙️ 2. API Backend Architecture & Technologies

* **Runtime:** Node.js (v22 LTS)
* **Framework:** Express.js (v5)
* **Database & ORM:** MongoDB Atlas Cloud Cluster / Mongoose ORM
* **Architecture Pattern:** Controller-Service pattern / Modular MVC with CommonJS modules
* **Authentication & Security:**
  * JWT (JSON Web Tokens) for sessionless authorization
  * [Helmet](https://helmetjs.github.io/) for HTTP security header mitigation
  * Configurable CORS origin policy (`CORS_ORIGIN` / `ALLOWED_ORIGINS`)
* **Logging & Observability:** [Winston](https://github.com/winstonjs/winston) (Structured JSON logging with request metadata, IP, and User-Agent)
* **Testing & Quality Assurance:**
  * **Unit & Integration Testing:** Jest + Supertest test suite
  * **Coverage Reporting:** Integrated Jest code coverage analytics
  * **Code Quality:** ESLint (v9 Flat Config) + Prettier

---

## 🛠️ 3. DevOps & DevSecOps Engineering Skills & Hardening Practices

* **Multi-Stage Containerization:**
  * Multi-stage Docker builds targeting minimal Alpine Linux base images (`node:22-alpine`, `nginx:1.27-alpine`).
  * Optimized layer caching by setting `--chown=appuser:appgroup` during build `COPY` steps, avoiding costly recursive `chown -R` layers across `node_modules`.
* **Least-Privilege Non-Root Execution:**
  * API container runs as unprivileged `appuser:appgroup`.
  * Frontend Nginx runs as unprivileged `webuser:webgroup` on non-privileged port `8080`.
* **Container Filesystem Hardening:**
  * Enforced `read_only: true` root filesystem protection.
  * Ephemeral `tmpfs` mounts (`/tmp`, `/var/cache/nginx`, `/var/run`) for temporary runtime file writes.
  * Security parameter `security_opt: [no-new-privileges:true]` enforced to block runtime privilege escalation.
* **Active Container Health Probes:**
  * API probed via native Node.js HTTP `/health` fetch script.
  * Frontend probed via `wget` probe on port 8080.
  * Docker Compose uses `condition: service_healthy` to gate service dependency startup.
* **Resource Governance & Log Rotation:**
  * CPU limits (`0.50` CPU) and memory limits (`512M` API, `256M` Web) configured under Compose `deploy.resources`.
  * Log rotation policy (`max-size: 10m`, `max-file: 3`) enforced to prevent host disk exhaustion.
* **Vulnerability Audit & Remediation:**
  * Remediated Vite 8 peer dependency conflicts and patched `esbuild` vulnerabilities (`GHSA-67mh-4wv8-2f99`), achieving **0 vulnerabilities** across all `npm audit` scans.
  * Integrated **Trivy** vulnerability & secret scanner with CI/CD build-break enforcement (`--exit-code 1`).
* **Automation & Pipeline Tooling:**
  * Dual-Compose specification (`compose.yaml` for production, `compose.dev.yaml` for live development).
  * Standardized GNU **Makefile** task runner for build, test, run, scan, health, and cleanup operations.

---

## 📁 Project Directory Structure

```text
cloudpath-focusflow/
├── app/
│   ├── src/
│   │   ├── config/          # Environment & database configuration
│   │   ├── controllers/     # Route logic handlers (Task & Journal)
│   │   ├── middleware/      # Security, logging, and error handling
│   │   ├── routes/          # Express API endpoints
│   │   ├── services/        # Business logic & data services
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
├── frontend/
│   ├── nginx/
│   │   └── default.conf     # Hardened Nginx reverse proxy configuration
│   ├── src/                 # React 19 source code & components
│   ├── Dockerfile           # Multi-stage Nginx production Docker image
│   ├── .dockerignore        # Frontend Docker context exclusions
│   ├── package.json         # React & Vite 7 dependencies
│   └── vite.config.js       # Vite bundler configuration
├── compose.yaml             # Hardened production Docker Compose spec
├── compose.dev.yaml         # Live development Docker Compose spec
├── Makefile                 # Pipeline & build automation task runner
└── README.md                # Project documentation
```

---

## ⚡ Full-Stack Local Run Guide

### Prerequisites
* **Docker Desktop** or **Docker Engine** (v20.10+)
* **Docker Compose** (v2.0+)
* **MongoDB Atlas** cluster connection string
* `app/.env` file created containing Atlas URI and JWT secret

---

### 1️⃣ Configure Environment

Create `app/.env` from `.env.example`:

```bash
cp app/.env.example app/.env
```

Ensure `app/.env` contains your MongoDB Atlas URI and JWT Secret:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/focusflow
JWT_SECRET=your_secure_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

---

### 2️⃣ Start Application

Launch the full production stack in detached mode:

```bash
docker compose up --build -d
```

---

### 3️⃣ Check Service Status

Verify that containers are running and healthy:

```bash
docker compose ps
```

---

### 4️⃣ Verify Endpoints & Proxy

* **Access Web Application (Frontend):**
  [http://localhost:3000](http://localhost:3000)

* **Check API through Nginx Reverse Proxy:**
  ```bash
  curl http://localhost:3000/api/v1/version
  ```

* **Check Direct API Health:**
  ```bash
  curl http://localhost:5000/health
  ```

---

### 5️⃣ Stop Application

Shut down containers and networks cleanly:

```bash
docker compose down
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

## 📋 Makefile Reference

| Target | Command | Description |
| :--- | :--- | :--- |
| `make help` | `make help` | Displays list of all available Makefile targets |
| `make dev` | `docker compose -f compose.dev.yaml up --build` | Starts live development environment with volume mounts |
| `make build` | `docker compose build` | Builds multi-stage production Docker images |
| `make up` | `docker compose up -d` | Launches production container stack in detached mode |
| `make down` | `docker compose down` | Stops and removes running containers |
| `make health` | `curl -s http://localhost:5000/health \| jq` | Checks application health status |
| `make test` | `cd app && npm test` | Runs Jest unit tests and generates coverage metrics |
| `make scan` | `trivy image --severity HIGH,CRITICAL ...` | Scans image for High/Critical vulnerabilities |
| `make scan-full` | `trivy image focusflow-api:1.0.0` | Runs full Trivy vulnerability scan |
| `make scan-json` | `trivy image --format json -o ...` | Generates structured JSON scan report |
| `make scan-ci` | `trivy image --exit-code 1 ...` | Enforces CI pipeline security gate |
| `make clean` | `docker compose down --rmi local --volumes` | Clean up containers, images, and volumes |

---

## 👤 Author & License

* **Author:** Kavindu Nadeeshan
* **License:** [MIT](LICENSE)