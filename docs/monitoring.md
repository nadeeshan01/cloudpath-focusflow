# FocusFlow Monitoring Guide

## Monitoring layers

| Layer | Tool | What is checked |
|---|---|---|
| Application | `/health` | API responds and process is healthy |
| Kubernetes workload | `kubectl get pods` | Pod status and readiness |
| Kubernetes Deployment | `kubectl rollout status` | Release progress |
| Kubernetes logs | `kubectl logs` | Requests, errors, and application events |
| Kubernetes events | `kubectl get events` | Probe, image, scheduling, and restart failures |
| Resource metrics | `kubectl top` | CPU and memory usage |
| AWS log configuration | CloudWatch Logs | Log group and retention policy |
| CI security | GitHub Actions | Tests, scans, and image validation |

## Health endpoint

```bash
curl http://localhost:8080/health
```

Expected:

```json
{
  "status": "ok"
}
```

## Key failure indicators

- Pod not ready: `0/1 Running`
- Restart loop: `CrashLoopBackOff`
- Probe failure: HTTP 404 or timeout in pod events
- Image problem: `ImagePullBackOff`
- Deployment not progressing: rollout status waits or times out
- Resource concern: CPU/memory exceeds defined request or limit

## Production improvements

- Deploy CloudWatch Container Insights for AWS ECS/EKS.
- Add Prometheus and Grafana dashboards.
- Add Alertmanager or CloudWatch alarms.
- Add uptime monitoring for `/health`.
- Add log aggregation with Loki or CloudWatch.
- Add SLOs for availability, latency, and error rate.