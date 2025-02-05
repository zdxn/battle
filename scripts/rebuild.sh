#!/bin/bash

echo "Cleaning and rebuilding project..."

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Clean and build backend
echo "Cleaning backend..."
cd backend || handle_error "Backend directory not found"
npm run clean || handle_error "Failed to clean backend"

echo "Building backend..."
npm run build || handle_error "Failed to build backend"

# Clean and build frontend
echo "Cleaning frontend..."
cd ../frontend || handle_error "Frontend directory not found"
rm -rf build || handle_error "Failed to clean frontend"

echo "Building frontend..."
npm run build || handle_error "Failed to build frontend"

echo "Project rebuilt successfully!"
