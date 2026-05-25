#!/bin/bash
set -e

read -p "This will permanently delete all MongoDB data. Type 'yes' to confirm: " confirmation

if [ "$confirmation" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

echo "Deleting MongoDB StatefulSet and PVC..."
kubectl delete statefulset mongodb -n chat-app
kubectl delete pvc mongo-data-mongodb-0 -n chat-app

echo "Recreating MongoDB..."
kubectl apply -f k8s/mongodb/

echo "Waiting for MongoDB to be ready..."
kubectl rollout status statefulset/mongodb -n chat-app

echo "Done."
