#!/bin/bash

# Exit on error
set -e

echo "🏗️ Building Battle Arena..."

# Build backend
echo "📦 Building backend..."
cd backend
npm install
npm run build

# Build frontend
echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build

# Build Docker images
echo "🐳 Building Docker images..."
cd ..
docker-compose build

echo "✅ Build complete! Run 'docker-compose up' to start the application."
