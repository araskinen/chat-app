#!/bin/bash
set -e

echo "Building client image..."
docker build -f client/Dockerfile \
  --build-arg VITE_API_URL=http://localhost:8080 \
  --build-arg VITE_SOCKET_URL=http://localhost:8080 \
  -t chat-app-client:latest .

echo "Importing image into k3d cluster..."
k3d image import chat-app-client:latest -c chat-app

echo "Restarting frontend pods..."
kubectl rollout restart deployment/frontend -n chat-app

echo "Waiting for rollout..."
kubectl rollout status deployment/frontend -n chat-app
