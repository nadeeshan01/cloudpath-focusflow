#!/usr/bin/env bash

set -euo pipefail

API_TAG="${1:?Usage: ./scripts/release-kind.sh <api-tag> <web-tag>}"
WEB_TAG="${2:?Usage: ./scripts/release-kind.sh <api-tag> <web-tag>}"

CLUSTER_NAME="cloudpath-local"
NAMESPACE="cloudpath"

echo "Building API image: focusflow-api:${API_TAG}"

docker build \
  --pull \
  --no-cache \
  -t "focusflow-api:${API_TAG}" \
  ./app

echo "Building frontend image: focusflow-web:${WEB_TAG}"

docker build \
  --pull \
  --no-cache \
  -f frontend/Dockerfile.k8s \
  --build-arg VITE_API_BASE_URL=/api/v1 \
  -t "focusflow-web:${WEB_TAG}" \
  ./frontend

echo "Scanning API image"

trivy image \
  --timeout 30m \
  --severity HIGH,CRITICAL \
  --ignore-unfixed \
  "focusflow-api:${API_TAG}"

echo "Scanning frontend image"

trivy image \
  --timeout 30m \
  --severity HIGH,CRITICAL \
  --ignore-unfixed \
  "focusflow-web:${WEB_TAG}"

echo "Loading images into Kind"

kind load docker-image \
  "focusflow-api:${API_TAG}" \
  --name "${CLUSTER_NAME}"

kind load docker-image \
  "focusflow-web:${WEB_TAG}" \
  --name "${CLUSTER_NAME}"

echo "Updating API Deployment"

kubectl -n "${NAMESPACE}" set image \
  deployment/focusflow-api \
  focusflow-api="focusflow-api:${API_TAG}"

echo "Updating frontend Deployment"

kubectl -n "${NAMESPACE}" set image \
  deployment/focusflow-web \
  focusflow-web="focusflow-web:${WEB_TAG}"

echo "Waiting for API rollout"

kubectl -n "${NAMESPACE}" rollout status \
  deployment/focusflow-api \
  --timeout=240s

echo "Waiting for frontend rollout"

kubectl -n "${NAMESPACE}" rollout status \
  deployment/focusflow-web \
  --timeout=180s

echo "Release completed successfully"