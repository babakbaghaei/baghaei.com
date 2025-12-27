#!/bin/bash

echo "🗄️  Setting up Database..."

cd backend

if [ ! -f .env ]; then
    echo "⚠️  .env file not found! Copying from .env.example..."
    cp .env.example .env
fi

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🚀 Running Migrations..."
npx prisma migrate dev --name init_setup

echo "🌱 Seeding Database..."
npx prisma db seed

echo "✅ Database setup complete!"
