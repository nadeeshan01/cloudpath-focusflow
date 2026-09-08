# Monitoring Limitations

## Local Kubernetes metrics

The project attempted to use Metrics Server to provide CPU and memory evidence
through `kubectl top nodes` and `kubectl top pods`.

If Metrics Server is unavailable or incompatible with the local Kind setup,
resource metrics may not be available.

## Evidence still available

The project provides:

- CPU and memory requests/limits in the Deployment manifest.
- Pod status and readiness evidence.
- Kubernetes events.
- Application logs.
- Health endpoint checks.
- Rollout and rollback evidence.
- CloudWatch log group configuration for future AWS workloads.

## Production improvement

A production AWS deployment would use CloudWatch Container Insights or a
Prometheus/Grafana stack for resource, application, and infrastructure metrics.