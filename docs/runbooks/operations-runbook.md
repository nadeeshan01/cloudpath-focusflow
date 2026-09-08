# FocusFlow Operations Runbook

## Purpose

This runbook explains how to check application health, logs, resources,
deployment status, and recovery actions.

## Check pod status

```bash
kubectl -n cloudpath get pods
```

Healthy expected state:

```text
READY   STATUS
1/1     Running
```

## Check deployment rollout

```bash
kubectl -n cloudpath rollout status deployment/focusflow-api
```

## Check deployment history

```bash
kubectl -n cloudpath rollout history deployment/focusflow-api
```

## Check health endpoint

```bash
kubectl -n cloudpath port-forward service/focusflow-api 8080:80
curl -i http://localhost:8080/health
```

Expected response:

```text
HTTP/1.1 200 OK
```

## Check logs

```bash
kubectl -n cloudpath logs deployment/focusflow-api --tail=200
```

Follow logs:

```bash
kubectl -n cloudpath logs deployment/focusflow-api --follow
```

## Check Kubernetes events

```bash
kubectl -n cloudpath get events --sort-by=.lastTimestamp
```

## Check CPU and memory

```bash
kubectl top nodes
kubectl -n cloudpath top pods
```

## Check container image

```bash
kubectl -n cloudpath get deployment focusflow-api \
  -o jsonpath='{.spec.template.spec.containers.image}{"\n"}'
```

## Roll back image release

```bash
kubectl -n cloudpath set image deployment/focusflow-api \
  focusflow-api=focusflow-api:1.0.0

kubectl -n cloudpath rollout status deployment/focusflow-api
```

## Restore health probes

```bash
kubectl patch deployment focusflow-api \
  -n cloudpath \
  --type=strategic \
  --patch-file k8s/patches/fix-probe.yaml
```

## Common failure signs

| Symptom                    | Check                          | Likely cause                                 |
| -------------------------- | ------------------------------ | -------------------------------------------- |
| Pod is `0/1 Running`       | `kubectl describe pod`         | Readiness or startup probe failure           |
| Pod is `CrashLoopBackOff`  | `kubectl logs POD --previous`  | Application startup error or liveness failure |
| Service is unavailable     | `/health`, endpoints, Service  | No ready Pods or wrong selector              |
| Image pull failure         | `kubectl get events`           | Image missing or registry credentials issue  |
| Resource usage unavailable | `kubectl top pods`             | Metrics Server unavailable                   |