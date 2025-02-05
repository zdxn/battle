#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying Battle Arena..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Pull latest changes
echo "⬇️ Pulling latest changes..."
git pull

# Build application
echo "🏗️ Building application..."
./scripts/build.sh

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d

echo "✅ Deployment complete! Application is running at http://localhost"
