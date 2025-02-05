#!/bin/bash

# Exit on error
set -e

echo "🏗️ Building Battle Arena..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies and build
echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build

# Build Docker images
echo "🐳 Building Docker images..."
cd ..
docker-compose build

echo "✅ Build complete!"
