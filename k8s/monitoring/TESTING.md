# Testing the OpenTelemetry Integration

This document provides instructions for testing the OpenTelemetry integration with the Kubernetes admission controller.

## Prerequisites

- A Kubernetes cluster with kubectl configured
- Access to create namespaces and deploy resources

## Deployment Steps

1. Deploy the OpenTelemetry collector and Jaeger:

```bash
# Create the monitoring namespace
kubectl create namespace monitoring

# Deploy the OpenTelemetry collector and Jaeger
kubectl apply -f k8s/monitoring/otel-collector.yaml

# Verify the collector and Jaeger are running
kubectl get pods -n monitoring
```

2. Deploy the admission controller with OpenTelemetry integration:

```bash
# Create the governance-system namespace
kubectl create namespace governance-system

# Create the policy ConfigMap
kubectl create configmap governance-policy-tiers --from-file=policy.yaml=policy.yaml -n governance-system

# Generate certificates for the webhook
cd k8s/admission-controller
./generate-certs.sh
kubectl apply -f webhook-certs-secret.yaml -n governance-system

# Deploy the admission controller
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f webhook.yaml
```

3. Create test deployments to trigger validation:

```bash
# Create test namespaces
kubectl create namespace test-app-DEV
kubectl create namespace test-app-QA
kubectl create namespace test-app-PROD

# Apply test deployments
kubectl apply -f k8s/admission-controller/test-deployments/dev-deployment.yaml
kubectl apply -f k8s/admission-controller/test-deployments/qa-deployment.yaml
kubectl apply -f k8s/admission-controller/test-deployments/prod-deployment.yaml
```

## Verification Steps

1. Check the OpenTelemetry collector logs to verify that telemetry data is being received:

```bash
kubectl logs -n monitoring deployment/otel-collector
```

You should see log entries similar to:

```
2025-04-19T17:30:00.000Z INFO TracesExporter {"kind": "exporter", "data_type": "traces", "name": "logging", "resource_spans": 1, "spans": 3}
```

2. Access the Jaeger UI to see the policy validation traces:

```bash
# Get the NodePort assigned to the Jaeger UI service
NODE_PORT=$(kubectl get svc jaeger-ui -n monitoring -o jsonpath='{.spec.ports[0].nodePort}')

# Access the UI at http://<node-ip>:<node-port>
echo "Jaeger UI is available at http://<node-ip>:$NODE_PORT"
```

3. In the Jaeger UI:
   - Select "governance-validator" from the Service dropdown
   - Click "Find Traces"
   - You should see traces for policy validation events

## Expected Telemetry Data

When examining traces in Jaeger, you should see:

1. **Spans**:
   - `handleValidate` - The main span for each admission request
   - `getTierForNamespace` - Span for determining the policy tier
   - `policy.validation` - Span for the actual policy validation

2. **Attributes** on the `policy.validation` span:
   - `namespace`: The Kubernetes namespace (e.g., "test-app-DEV")
   - `deployment.name`: The name of the deployment (e.g., "test-app")
   - `policy.tier`: The policy tier level (e.g., 2 for DEV)
   - `environment`: The environment (e.g., "DEV")
   - `validation.result`: Whether validation passed (true/false)
   - `policy.code_coverage`: Code coverage percentage (e.g., 82)
   - `policy.critical_vulnerabilities`: Number of critical vulnerabilities (e.g., 0)
   - `policy.high_vulnerabilities`: Number of high vulnerabilities (e.g., 3)

## Troubleshooting

If you don't see any traces in Jaeger:

1. Verify the OpenTelemetry collector is running:
   ```bash
   kubectl get pods -n monitoring
   ```

2. Check the collector logs for errors:
   ```bash
   kubectl logs -n monitoring deployment/otel-collector
   ```

3. Verify the admission controller is configured with the correct OTLP endpoint:
   ```bash
   kubectl get deployment governance-validator -n governance-system -o jsonpath='{.spec.template.spec.containers[0].env[?(@.name=="OTLP_ENDPOINT")].value}'
   ```

4. Ensure the admission controller is receiving validation requests by checking its logs:
   ```bash
   kubectl logs -n governance-system deployment/governance-validator
   ```

## Example Visualization

When viewing traces in Jaeger, you can:

1. See the full validation flow from admission request to validation result
2. Filter traces by validation result (pass/fail)
3. Compare validation across different environments (DEV/QA/PROD)
4. Analyze validation failures by specific policy criteria

This telemetry data provides real-time feedback to delivery teams on policy compliance and enables visualization of validation results across the organization.
