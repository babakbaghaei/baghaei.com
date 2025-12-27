#!/bin/bash

# Configuration
# SERVER_IP="your-server-ip" # Set in environment variable
# SERVER_USER="root" # Set in environment variable
PROJECT_PATH="/root/baghaei.com"

if [ -z "$SERVER_IP" ]; then
    echo "❌ Error: SERVER_IP environment variable is not set."
    exit 1
fi

echo "🚀 Starting Deployment Process to $SERVER_IP..."

# Use SSH Key-based authentication (Assumes user has set up SSH keys)
ssh -o StrictHostKeyChecking=no ${SERVER_USER:-root}@$SERVER_IP << EOF
    echo "📂 Navigating to project directory..."
    cd $PROJECT_PATH || { echo "❌ Directory not found"; exit 1; }

    echo "📥 Pulling latest changes from Git..."
    git pull origin main || { echo "❌ Git pull failed"; exit 1; }

    # Function to install dependencies with fallback
    install_deps() {
        local dir=\$1
        echo "📦 Installing dependencies in \$dir..."
        cd $PROJECT_PATH/\$dir
        if npm install; then
            echo "✅ Standard install successful in \$dir"
        else
            echo "⚠️ Standard install failed, trying with --legacy-peer-deps..."
            if npm install --legacy-peer-deps; then
                echo "✅ Install with --legacy-peer-deps successful in \$dir"
            else
                echo "❌ Dependency installation failed in \$dir"; exit 1;
            fi
        fi
    }

    # Backend Build
    install_deps "backend"
    echo "🗄️ Running Prisma Generate & Migrate..."
    cd $PROJECT_PATH/backend
    npx prisma generate || { echo "❌ Prisma generate failed"; exit 1; }
    npx prisma migrate deploy || { echo "❌ Prisma migrate failed"; exit 1; }
    
    echo "🏗️ Building Backend..."
    npm run build || { echo "❌ Backend build failed"; exit 1; }

    # Frontend Build
    install_deps "frontend"
    echo "🏗️ Building Frontend..."
    npm run build || { echo "❌ Frontend build failed"; exit 1; }

    echo "♻️ Restarting all processes with PM2..."
    pm2 restart all || pm2 start all

    echo "📊 Current PM2 Status:"
    pm2 list
EOF

if [ $? -eq 0 ]; then
    echo "✨ DEPLOYMENT SUCCESSFUL! Your site is updated and running."
else
    echo "💥 DEPLOYMENT FAILED! Please check the logs above."
fi
