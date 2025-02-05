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

# Start backend in background
echo "Starting backend server..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# Start frontend in background
echo "Starting frontend server..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

# Function to clean up background processes
cleanup() {
    echo "Cleaning up..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    
    if command_exists mongod; then
        mongod --shutdown
    fi
    
    if command_exists redis-cli; then
        redis-cli shutdown
    fi
}

trap cleanup EXIT

# Wait for any key to terminate
echo "Press any key to stop all services..."
read -n 1 -s
