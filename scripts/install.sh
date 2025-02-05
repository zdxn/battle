#!/bin/bash

echo "Installing project dependencies..."

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend || handle_error "Backend directory not found"
npm install || handle_error "Failed to install backend dependencies"

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend || handle_error "Frontend directory not found"
npm install || handle_error "Failed to install frontend dependencies"

echo "All dependencies installed successfully!"
