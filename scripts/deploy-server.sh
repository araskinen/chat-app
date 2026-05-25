#!/bin/bash
set -e

echo "Building server image..."
docker build -f server/Dockerfile -t chat-app-server:latest .

echo "Importing image into k3d cluster..."
k3d image import chat-app-server:latest -c chat-app

echo "Restarting backend pods..."
kubectl rollout restart deployment/backend -n chat-app

echo "Waiting for rollout..."
kubectl rollout status deployment/backend -n chat-app
