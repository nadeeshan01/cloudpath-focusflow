#!/usr/bin/env bash

set -euo pipefail

API_TAG="${1:?Usage: ./scripts/rollback-kind.sh <api-tag> <web-tag> <app-version> <api-version>}"
WEB_TAG="${2:?Usage: ./scripts/rollback-kind.sh <api-tag> <web-tag> <app-version> <api-version>}"
APP_VERSION="${3:?Usage: ./scripts/rollback-kind.sh <api-tag> <web-tag> <app-version> <api-version>}"
API_VERSION="${4:?Usage: ./scripts/rollback-kind.sh <api-tag> <web-tag> <app-version> <api-version>}"

NAMESPACE="cloudpath"

echo "Restoring ConfigMap values"

kubectl -n "${NAMESPACE}" create configmap focusflow-config \
  --from-literal=NODE_ENV=production \
  --from-literal=APP_NAME=focusflow-api \
  --from-literal=APP_VERSION="${APP_VERSION}" \
  --from-literal=API_VERSION="${API_VERSION}" \
  --from-literal=LOG_LEVEL=info \
  --from-literal=CORS_ORIGIN=http://localhost:8080 \
  --dry-run=client \
  -o yaml \
  | kubectl apply -f -

echo "Rolling back API image to focusflow-api:${API_TAG}"

kubectl -n "${NAMESPACE}" set image \
  deployment/focusflow-api \
  focusflow-api="focusflow-api:${API_TAG}"

echo "Rolling back frontend image to focusflow-web:${WEB_TAG}"

kubectl -n "${NAMESPACE}" set image \
  deployment/focusflow-web \
  focusflow-web="focusflow-web:${WEB_TAG}"

echo "Restarting API to load ConfigMap values"

kubectl -n "${NAMESPACE}" rollout restart deployment/focusflow-api

echo "Waiting for API rollout"

kubectl -n "${NAMESPACE}" rollout status \
  deployment/focusflow-api \
  --timeout=240s

echo "Waiting for frontend rollout"

kubectl -n "${NAMESPACE}" rollout status \
  deployment/focusflow-web \
  --timeout=180s

echo "Rollback completed successfully"