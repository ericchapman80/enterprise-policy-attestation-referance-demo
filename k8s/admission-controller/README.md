# Kubernetes Admission Controller for Governance Policies

This directory contains a Kubernetes admission controller implementation that enforces governance policies based on a tiered system (0-3) and environment-specific rules.

## Overview

The admission controller validates Kubernetes deployments against governance policies defined in the root `policy.yaml` file. The policies are enforced based on:

1. A tiered system (0-3):
   - Tier 0: Most strict (Production)
   - Tier 1: Strict (QA/Staging)
   - Tier 2: Moderate (Development)
   - Tier 3: Relaxed (Development/Testing)

2. Environment-based rules using namespace suffixes:
   - Production: `-PROD` or `-prod`
   - QA: `-QA` or `-qa`
   - Development: `-DEV` or `-dev`
   - Development Testing: `-DEV-TEST` or `-dev-test`

## Components

- **validator.go**: The main admission controller logic
- **deployment.yaml**: Kubernetes deployment for the admission controller
- **service.yaml**: Kubernetes service for the admission controller
- **webhook.yaml**: ValidatingWebhookConfiguration for registering the admission controller
- **Dockerfile**: For building the admission controller container image

## Deployment

1. Build the container image:
   ```bash
   docker build -t governance-validator:latest .
   ```

2. Push the image to your container registry:
   ```bash
   docker tag governance-validator:latest ${REGISTRY}/governance-validator:latest
   docker push ${REGISTRY}/governance-validator:latest
   ```

3. Create the namespace:
   ```bash
   kubectl create namespace governance-system
   ```

4. Generate TLS certificates for the webhook:
   ```bash
   ./generate-certs.sh
   ```

5. Create the ConfigMap from the policy file:
   ```bash
   kubectl create configmap governance-policy-tiers --from-file=policy.yaml=../../policy.yaml -n governance-system
   ```

6. Deploy the admission controller:
   ```bash
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   kubectl apply -f webhook.yaml
   ```

## How It Works

The admission controller intercepts CREATE and UPDATE operations on Deployment resources and validates them against the policy tier that applies to the namespace. The validation checks:

1. Code coverage requirements
2. Vulnerability thresholds (critical and high)
3. Build provenance attestation requirements
4. SBOM requirements
5. Security scan requirements

Deployments must include annotations with governance information:

```yaml
metadata:
  annotations:
    governance.io/code-coverage: "85"
    governance.io/critical-vulnerabilities: "0"
    governance.io/high-vulnerabilities: "2"
    governance.io/build-provenance: "verified"
    governance.io/sbom: "verified"
    governance.io/security-scan: "verified"
```

## Testing

To test the admission controller, you can create test deployments in different namespaces:

```bash
# Create test namespaces
kubectl create namespace test-app-DEV
kubectl create namespace test-app-QA
kubectl create namespace test-app-PROD

# Apply test deployments
kubectl apply -f test-deployments/dev-deployment.yaml
kubectl apply -f test-deployments/qa-deployment.yaml
kubectl apply -f test-deployments/prod-deployment.yaml
```
