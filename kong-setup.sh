#!/bin/bash
# kong-setup.sh - Script to configure Kong API Gateway

# Wait for Kong Admin API to be ready
echo "Waiting for Kong Admin API to be ready..."
until curl -f http://localhost:8001/; do
  sleep 2
done

echo "Kong Admin API is ready. Setting up services and routes..."

# Create a service for the backend API
curl -i -X POST http://localhost:8001/services \
  --data name=backend-api \
  --data url=http://backend:3001

# Create a route for the backend API
curl -i -X POST http://localhost:8001/services/backend-api/routes \
  --data paths[]=/api \
  --data name=backend-api-route

# Add rate limiting plugin
curl -i -X POST http://localhost:8001/services/backend-api/plugins \
  --data name=rate-limiting \
  --data config.second=10 \
  --data config.hour=10000

# Add authentication plugin if needed
curl -i -X POST http://localhost:8001/services/backend-api/plugins \
  --data name=key-auth

# Create a service for Keycloak
curl -i -X POST http://localhost:8001/services \
  --data name=keycloak-auth \
  --data url=http://keycloak:8080

# Create a route for Keycloak
curl -i -X POST http://localhost:8001/services/keycloak-auth/routes \
  --data paths[]=/auth/keycloak \
  --data name=keycloak-route

echo "Kong API Gateway configuration completed!"