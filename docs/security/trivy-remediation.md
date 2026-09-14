# Trivy Container Vulnerability Remediation

## Date
2026-09-14

## Context & Issue
The CI/CD pipeline failed at the Trivy container image scan stage with exit code 1 due to detected HIGH and CRITICAL vulnerabilities.
- `focusflow-api`: Failed with 2 HIGH Alpine OS CVEs and 11 HIGH/CRITICAL Node CLI package vulnerabilities (in bundled `npm`).
- `focusflow-web`: Failed with 36 HIGH/CRITICAL CVEs in base Alpine packages (`c-ares`, `libcrypto3`, `libssl3`, `libxml2`, `musl`, `zlib`).

## Root Cause Analysis
The application code and project dependencies (`app/package.json` and `frontend/package.json`) were completely clean. The findings originated exclusively from outdated base Alpine OS packages and bundled build tooling (`npm`, `yarn`, `corepack`) shipped within upstream base images.

## Remediation Actions
1. **OS Package Patching:** Added `RUN apk update && apk upgrade --no-cache` to the runtime stage of both `app/Dockerfile` and `frontend/Dockerfile` to apply available vendor security patches.
2. **Runtime Tooling Stripping:** Removed unnecessary global build tools (`npm`, `yarn`, `corepack`) from the backend production runtime container, preventing exploitation of CLI dependencies in production.
3. **CI Pipeline Optimization:** Configured CI build steps with `--pull --no-cache` to prevent stale layer caching.

## Scan Outcome
| Target Image | Initial Findings (H/C) | Remediated Findings (H/C) | Quality Gate Status |
|---|---|---|---|
| `focusflow-api` | 13 (12 HIGH, 1 CRITICAL) | 0 HIGH, 0 CRITICAL | **PASSED** |
| `focusflow-web` | 36 (34 HIGH, 2 CRITICAL) | 0 HIGH, 0 CRITICAL | **PASSED** |