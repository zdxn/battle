#!/bin/bash

echo "Cleaning up development environment..."

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Stop MongoDB if running
if pgrep mongod >/dev/null; then
    echo "Stopping MongoDB..."
    mongod --shutdown || handle_error "Failed to stop MongoDB"
fi

# Stop Redis if running
if pgrep redis-server >/dev/null; then
    echo "Stopping Redis..."
    redis-cli shutdown || handle_error "Failed to stop Redis"
fi

# Clean backend
echo "Cleaning backend..."
cd backend || handle_error "Backend directory not found"
npm run clean || handle_error "Failed to clean backend"
rm -rf node_modules || handle_error "Failed to remove backend node_modules"

# Clean frontend
echo "Cleaning frontend..."
cd ../frontend || handle_error "Frontend directory not found"
rm -rf build || handle_error "Failed to remove frontend build"
rm -rf node_modules || handle_error "Failed to remove frontend node_modules"

# Remove logs
echo "Removing logs..."
sudo rm -rf /var/log/mongodb/* || echo "No MongoDB logs to clean"
sudo rm -rf /var/log/redis/* || echo "No Redis logs to clean"

echo "Cleanup completed successfully!"
