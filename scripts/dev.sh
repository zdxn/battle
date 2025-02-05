#!/bin/bash

echo "Starting development environment..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Check if MongoDB is installed
if command_exists mongod; then
    echo "Starting MongoDB..."
    mongod --fork --logpath /var/log/mongodb/mongod.log || handle_error "Failed to start MongoDB"
else
    echo "Warning: MongoDB is not installed locally"
fi

# Check if Redis is installed
if command_exists redis-server; then
    echo "Starting Redis..."
    redis-server --daemonize yes || handle_error "Failed to start Redis"
else
    echo "Warning: Redis is not installed locally"
fi

# Wait for databases to start
sleep 5

# Start backend in development mode
echo "Starting backend..."
cd backend || handle_error "Backend directory not found"
npm run dev &
BACKEND_PID=$!

# Start frontend in development mode
echo "Starting frontend..."
cd ../frontend || handle_error "Frontend directory not found"
npm start &
FRONTEND_PID=$!

echo "Development environment is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"

# Handle cleanup on script termination
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    redis-cli shutdown 2>/dev/null
    mongod --shutdown 2>/dev/null
}

trap cleanup EXIT

# Wait for any key to terminate
echo "Press any key to stop all services..."
read -n 1
