# Week 7 Mentor Update

## Work completed

- Verified Kubernetes Deployment, Pods, Service, rollout status, and history.
- Verified startup, readiness, and liveness probes use `/health`.
- Tested the live health endpoint through port-forward.
- Captured application logs and live request logs.
- Captured Kubernetes events.
- Captured Deployment and Pod descriptions.
- Attempted and captured CPU/memory metrics using Metrics Server.
- Verified AWS CloudWatch log group and retention configuration.
- Created operations runbook.
- Created monitoring guide.
- Updated troubleshooting log.
- Performed repository cleanup and final quality/security checks.

## Demonstrable evidence

- Running Pods and resources.
- Healthy `/health` response.
- Application request logs.
- Kubernetes events.
- CPU/memory output or Metrics Server limitation output.
- CloudWatch log group and retention evidence.
- Operations runbook.
- Troubleshooting log.
- Final Trivy scan.

## Monitoring design

- Local Kubernetes uses `kubectl get`, `kubectl logs`, `kubectl get events`,
  `kubectl top`, and health probes.
- AWS is prepared with a CloudWatch log group with a defined retention period.
- Prometheus/Grafana is an optional future enhancement.

## Current limitations

- Local Kind logs are not automatically streamed to CloudWatch.
- Metrics Server may be unavailable or require Kind-specific configuration.
- Prometheus/Grafana is optional and not required for the core demonstration.
- AWS production compute deployment is not active in this local monitoring stage.

## Next week plan

- Freeze final code.
- Create release tag.
- Verify setup on a clean environment.
- Complete final report and presentation.
- Prepare live demo and individual defence.