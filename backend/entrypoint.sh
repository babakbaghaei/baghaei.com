#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
# Simple wait loop (or use netcat if available)
sleep 5

# Run migrations
echo "Running migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
node dist/src/main.js
