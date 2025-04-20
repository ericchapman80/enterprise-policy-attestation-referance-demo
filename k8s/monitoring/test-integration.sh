
echo "Creating monitoring namespace..."
kubectl create namespace monitoring

echo "Deploying OpenTelemetry collector and Jaeger..."
kubectl apply -f otel-collector.yaml

echo "Waiting for OpenTelemetry collector to be ready..."
kubectl wait --for=condition=available --timeout=60s deployment/otel-collector -n monitoring

echo "Creating governance-system namespace..."
kubectl create namespace governance-system

echo "Creating policy ConfigMap..."
kubectl create configmap governance-policy-tiers --from-file=policy.yaml=../../policy.yaml -n governance-system

echo "Generating certificates for the webhook..."
cd ../admission-controller
./generate-certs.sh
kubectl apply -f webhook-certs-secret.yaml -n governance-system

echo "Deploying admission controller with OpenTelemetry integration..."
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f webhook.yaml

echo "Waiting for admission controller to be ready..."
kubectl wait --for=condition=available --timeout=60s deployment/governance-validator -n governance-system

echo "Creating test namespaces..."
kubectl create namespace test-app-DEV
kubectl create namespace test-app-QA
kubectl create namespace test-app-PROD

echo "Applying test deployments..."
kubectl apply -f test-deployments/dev-deployment.yaml
kubectl apply -f test-deployments/qa-deployment.yaml
kubectl apply -f test-deployments/prod-deployment.yaml

echo "Checking OpenTelemetry collector logs..."
kubectl logs -n monitoring deployment/otel-collector

echo "Getting Jaeger UI access information..."
NODE_PORT=$(kubectl get svc jaeger-ui -n monitoring -o jsonpath='{.spec.ports[0].nodePort}')
echo "Jaeger UI is available at http://<node-ip>:$NODE_PORT"

echo "Test completed. Check the Jaeger UI to see the policy validation traces."
