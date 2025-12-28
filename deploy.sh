#!/bin/bash

# Configuration
SERVER_USER="root"
SERVER_IP="46.249.99.158" # Replace with actual IP
PROJECT_DIR="/var/www/baghaei.com"

echo "🚀 Starting Deployment..."

# 1. SSH into server and pull latest changes
ssh $SERVER_USER@$SERVER_IP << EOF
    cd $PROJECT_DIR
    echo "📥 Pulling latest changes..."
    git pull origin main

    echo "🐳 Building and restarting containers..."
    docker-compose down
    docker-compose up -d --build

    echo "🗄️ Running database migrations..."
    docker-compose exec -T backend npx prisma migrate deploy

    echo "🧹 Cleaning up..."
    docker image prune -f
EOF

echo "✅ Deployment Complete!"
