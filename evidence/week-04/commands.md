# 🛠️ Week 04 — Kubernetes & Kind Command Reference

> **Project:** CloudPath FocusFlow (`focusflow-api`)  
> **Purpose:** Command reference for Kind cluster management, Docker image loading, Kubernetes manifest deployment, and cluster debugging.

---

## 📦 1. Kind Cluster Management

### Create Cluster
```bash
kind create cluster --name cloudpath-local
```

### List Clusters
```bash
kind get clusters
```

### Delete Cluster
```bash
kind delete cluster --name cloudpath-local
```

---

## 🐳 2. Local Docker Operations

### Build Image with Specific Tags
```bash
docker build --pull \
  -t focusflow-api:0.1.0 \
  -t focusflow-api:week4 \
  ./app
```

### Verify Image Exists Locally
```bash
docker images | grep focusflow-api
```

### Run Container Locally
```bash
docker run --rm -d \
  --name focusflow-test \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e APP_NAME=focusflow-api \
  -e APP_VERSION=0.1.0 \
  focusflow-api:0.1.0
```

### Test Container Health
```bash
curl http://localhost:5000/health
```

### Stop Local Container
```bash
docker stop focusflow-test
```

---

## 📥 3. Loading Image into Kind Cluster

### Load Docker Image into Kind Node
```bash
kind load docker-image focusflow-api:0.1.0 \
  --name cloudpath-local
```

**Expected output:**
```text
Image: "focusflow-api:0.1.0" with ID "sha256:abc123..." not yet present on node "cloudpath-local-control-plane", loading...
```

### Capture Evidence of Image Load
```bash
kind load docker-image focusflow-api:0.1.0 \
  --name cloudpath-local \
  2>&1 | tee evidence/week-04/02-image-load.txt
```

### Check Images Inside Kind Node
> 💡 `crictl` is the Container Runtime Interface (CRI) CLI tool inside Kubernetes nodes (similar to Docker CLI for local host).

```bash
docker exec -it cloudpath-local-control-plane \
  crictl images | grep focusflow-api
```

**Expected output:**
```text
docker.io/library/focusflow-api  0.1.0  abc123  149MB
```

> ✅ If you see this output, the image is ready for Kubernetes workloads!

---

## ☸️ 4. Kubernetes Resource Management

### Apply Manifests
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.local.yaml
kubectl apply -k k8s/
```

### Check Rollout Status
```bash
kubectl -n cloudpath rollout status deployment/focusflow-api
```

### Get All Resources
```bash
kubectl -n cloudpath get all
kubectl -n cloudpath get configmap
kubectl -n cloudpath get secret
kubectl -n cloudpath get pods -o wide
```

---

## 🌐 5. Access Application

### Port Forwarding
```bash
kubectl -n cloudpath port-forward service/focusflow-api 8080:80
```

### Test Health
```bash
curl http://localhost:8080/health
```

---

## 🔍 6. Debugging & Inspection

### Pod Logs

#### All Pods in Deployment
```bash
kubectl -n cloudpath logs deployment/focusflow-api
```

#### Specific Pod
```bash
kubectl -n cloudpath logs pod/focusflow-api-xxxxx
```

#### Stream Logs (Follow)
```bash
kubectl -n cloudpath logs deployment/focusflow-api --follow
```

### Check Events
```bash
kubectl -n cloudpath get events --sort-by=.lastTimestamp
```

### Describe Resources
```bash
kubectl -n cloudpath describe deployment focusflow-api
kubectl -n cloudpath describe pod focusflow-api-xxxxx
kubectl -n cloudpath describe service focusflow-api
```

### Execute Shell Command in Pod
```bash
kubectl -n cloudpath exec -it pod/focusflow-api-xxxxx -- sh
```

### Check Resource Usage
```bash
kubectl -n cloudpath top pods
kubectl -n cloudpath top nodes
```

---

## 🧹 7. Cleanup

### Delete Namespace (Deletes Everything Inside)
```bash
kubectl delete namespace cloudpath
```

### Delete Specific Resources
```bash
kubectl -n cloudpath delete deployment focusflow-api
kubectl -n cloudpath delete service focusflow-api
```

# Validate YAML syntax and K8s schema
# Without Kustomize:
```bash
kubectl apply --dry-run=client -f k8s/namespace.yaml

kubectl apply --dry-run=client -f k8s/configmap.yaml

kubectl apply --dry-run=client -f k8s/secret.local.yaml

kubectl apply --dry-run=client -f k8s/deployment.yaml

kubectl apply --dry-run=client -f k8s/service.yaml

kubectl apply --dry-run=client -f k8s/pod-disruption-budget.yaml

kubectl apply --dry-run=client -f k8s/network-policy.yaml
```
#with kustomize
```bash
kubectl apply -k k8s/ --dry-run=client
```

## Apply all resources in order
# Without Kustomize:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

# ... repeat for each file

# With Kustomize:

```bash
kubectl apply -k k8s/
```

# Applies all resources in order! 🎉

### Pre-Deployment Checklist

```bash
cd ~/cloudpath-focusflow

# 1. Verify you're on the right branch
git branch --show-current
# Should show: feature/kubernetes-local-deployment

# 2. Verify Kind cluster is running
kind get clusters
# Should show: cloudpath-local

# 3. Verify kubectl context
kubectl config current-context
# Should show: kind-cloudpath-local

# 4. Verify Docker image exists locally
docker images | grep focusflow-api
# Should show: focusflow-api   0.1.0

# 5. Verify image is loaded in Kind
docker exec -it cloudpath-local-control-plane crictl images | grep focusflow-api
# Should show the image

# 6. List all manifest files
ls -la k8s/
# Should show all YAML files
```

# Watch deployment progress (real-time)
```bash
kubectl -n cloudpath rollout status deployment/focusflow-api
```
# You'll see:
# Waiting for deployment "focusflow-api" rollout to finish: 0 of 2 updated replicas are available...
# Waiting for deployment "focusflow-api" rollout to finish: 1 of 2 updated replicas are available...
# deployment "focusflow-api" successfully rolled out ✅

## if rollout is stuck, check:

```bash
# See what's happening
kubectl -n cloudpath get pods

# Describe pods to see errors
kubectl -n cloudpath describe pod <pod-name>

# Check events
kubectl -n cloudpath get events --sort-by=.lastTimestamp
```

# Get ALL resources in namespace
```bash
kubectl -n cloudpath get all -o wide
```

## Check each resource type:

```bash
# ConfigMaps
kubectl -n cloudpath get configmap
# Should show: focusflow-config

# Secrets
kubectl -n cloudpath get secret
# Should show: focusflow-secret

# Pods (detailed)
kubectl -n cloudpath get pods -o wide

# Services
kubectl -n cloudpath get svc
# Should show: focusflow-api (ClusterIP)

# Pod Disruption Budget
kubectl -n cloudpath get pdb
# Should show: focusflow-api-pdb

# Network Policy
kubectl -n cloudpath get networkpolicy
# Should show: focusflow-api-netpol

# Describe the pod (VERY DETAILED)
kubectl -n cloudpath describe pod $POD_NAME

# Get pod IP
POD_IP=$(kubectl -n cloudpath get pod $POD_NAME -o jsonpath='{.status.podIP}')

echo "Pod IP: $POD_IP"

# Test health endpoint directly (from another pod)
kubectl -n cloudpath run curl-test --image=curlimages/curl --rm -it --restart=Never -- \
  curl http://$POD_IP:5000/health

# Start port-forward (runs in foreground)
kubectl -n cloudpath port-forward service/focusflow-api 8080:80

Get the Pod Name Again
Bash

# Get the pod name and set it as variable
POD_NAME=$(kubectl -n cloudpath get pod -l app.kubernetes.io/name=focusflow-api -o jsonpath='{.items[0].metadata.name}')

# Verify it's set
echo "Pod name: $POD_NAME"
Expected output:

text

Pod name: focusflow-api-xxxxxxxxx-xxxxx
Step 2: Now Run the Commands Again
Bash

# Check pod security context
kubectl -n cloudpath get pod $POD_NAME -o jsonpath='{.spec.securityContext}' | jq

# Check container security context
kubectl -n cloudpath get pod $POD_NAME -o jsonpath='{.spec.containers[0].securityContext}' | jq

# Check user ID
kubectl -n cloudpath exec $POD_NAME -- id

# Test read-only filesystem
kubectl -n cloudpath exec $POD_NAME -- touch /test.txt

If you don't want to use variables, you can use the pod name directly:

Bash

# Get pod name first
kubectl -n cloudpath get pods

# Copy the exact pod name, then use it:
# Replace focusflow-api-xxxxxxxxx-xxxxx with your actual pod name

kubectl -n cloudpath get pod focusflow-api-xxxxxxxxx-xxxxx -o jsonpath='{.spec.securityContext}' | jq

kubectl -n cloudpath exec focusflow-api-xxxxxxxxx-xxxxx -- id

Verify Security Settings

# Check pod security context
kubectl -n cloudpath get pod $POD_NAME -o jsonpath='{.spec.securityContext}' | jq

# Should show:
# {
#   "fsGroup": 1000,
#   "runAsGroup": 1000,
#   "runAsNonRoot": true,
#   "runAsUser": 1000,
#   "seccompProfile": {
#     "type": "RuntimeDefault"
#   }
# }

# Check container security context
kubectl -n cloudpath get pod $POD_NAME \
  -o jsonpath='{.spec.containers[0].securityContext}' | jq

# Should show:
# {
#   "allowPrivilegeEscalation": false,
#   "capabilities": {
#     "drop": ["ALL"]
#   },
#   "readOnlyRootFilesystem": true
# }

# Verify user inside container
kubectl -n cloudpath exec $POD_NAME -- id

# Should show:
# uid=1000 gid=1000 groups=1000  ← NOT root! ✅

# Try to write to root filesystem (should fail)
kubectl -n cloudpath exec $POD_NAME -- touch /test.txt

# Expected error:
# touch: /test.txt: Read-only file system  ✅ Good!

# Verify /tmp is writable
kubectl -n cloudpath exec $POD_NAME -- touch /tmp/test.txt

# Should succeed (no output) ✅

# Capture security verification
cat > evidence/week-04/12-security-verification.txt << 'EOF'
Security Context Verification
==============================

Pod Security Context:
$(kubectl -n cloudpath get pod $POD_NAME -o jsonpath='{.spec.securityContext}' | jq)

Container Security Context:
$(kubectl -n cloudpath get pod $POD_NAME -o jsonpath='{.spec.containers[0].securityContext}' | jq)

User Verification:
$(kubectl -n cloudpath exec $POD_NAME -- id)

Read-only Root FS Test:
$(kubectl -n cloudpath exec $POD_NAME -- touch /test.txt 2>&1 || echo "✅ Root FS is read-only")

Writable /tmp Test:
$(kubectl -n cloudpath exec $POD_NAME -- sh -c 'touch /tmp/test && echo "✅ /tmp is writable"')

All security settings verified ✅
