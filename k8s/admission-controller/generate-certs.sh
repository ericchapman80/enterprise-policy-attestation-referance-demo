
set -e

openssl genrsa -out ca.key 2048
openssl req -new -x509 -days 365 -key ca.key -subj "/CN=admission-controller-ca" -out ca.crt

openssl genrsa -out server.key 2048
openssl req -new -key server.key -subj "/CN=governance-validator.governance-system.svc" -out server.csr

openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365

kubectl create secret tls governance-validator-certs \
    --cert=server.crt \
    --key=server.key \
    -n governance-system \
    --dry-run=client -o yaml > webhook-certs-secret.yaml

CA_BUNDLE=$(cat ca.crt | base64 | tr -d '\n')
sed -i "s/\${CA_BUNDLE}/${CA_BUNDLE}/g" webhook.yaml

echo "Certificate generation complete."
echo "To deploy the webhook:"
echo "1. kubectl apply -f webhook-certs-secret.yaml"
echo "2. kubectl apply -f webhook.yaml"

rm ca.key ca.srl server.csr
