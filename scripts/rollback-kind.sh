#!/usr/bin/env bash

set -euo pipefail

API_TAG="${1:?Usage: ./scripts/rollback-kind.sh <api-tag> <web-tag>}"
WEB_TAG="${2:?Usage: ./scripts/rollback-kind.sh <api-tag> <web-tag>}"

NAMESPACE="cloudpath"

echo "Rolling back API to focusflow-api:${API_TAG}"

kubectl -n "${NAMESPACE}" set image \
  deployment/focusflow-api \
  focusflow-api="focusflow-api:${API_TAG}"

echo "Rolling back frontend to focusflow-web:${WEB_TAG}"

kubectl -n "${NAMESPACE}" set image \
  deployment/focusflow-web \
  focusflow-web="focusflow-web:${WEB_TAG}"

echo "Waiting for API rollback"

kubectl -n "${NAMESPACE}" rollout status \
  deployment/focusflow-api \
  --timeout=240s

echo "Waiting for frontend rollback"

kubectl -n "${NAMESPACE}" rollout status \
  deployment/focusflow-web \
  --timeout=180s

echo "Rollback completed successfully"