# OpenTelemetry Monitoring Setup

This directory contains the configuration for deploying an OpenTelemetry collector and Jaeger for visualization of policy validation telemetry data.

## Components

- **OpenTelemetry Collector**: Receives, processes, and exports telemetry data
- **Jaeger**: Distributed tracing system for visualization

## Deployment

To deploy the monitoring stack:

```bash
# Create the monitoring namespace
kubectl create namespace monitoring

# Apply the OpenTelemetry collector and Jaeger configuration
kubectl apply -f otel-collector.yaml

# Verify the collector and Jaeger are running
kubectl get pods -n monitoring

# Check the services
kubectl get svc -n monitoring
```

## Accessing Jaeger UI

The Jaeger UI is exposed as a NodePort service. To access it:

```bash
# Get the NodePort assigned to the Jaeger UI service
kubectl get svc jaeger-ui -n monitoring -o jsonpath='{.spec.ports[0].nodePort}'

# Access the UI at http://<node-ip>:<node-port>
```

## Testing the OpenTelemetry Integration

To test that the OpenTelemetry integration is working correctly:

1. Deploy the admission controller with OpenTelemetry integration:
   ```bash
   kubectl apply -f ../admission-controller/deployment.yaml
   ```

2. Create test deployments in different namespaces:
   ```bash
   kubectl apply -f ../admission-controller/test-deployments/dev-deployment.yaml
   kubectl apply -f ../admission-controller/test-deployments/qa-deployment.yaml
   kubectl apply -f ../admission-controller/test-deployments/prod-deployment.yaml
   ```

3. Check the OpenTelemetry collector logs to verify that telemetry data is being received:
   ```bash
   kubectl logs -n monitoring deployment/otel-collector
   ```

4. Access the Jaeger UI to see the policy validation traces.

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
