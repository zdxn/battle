#!/bin/bash

echo "Running all tests..."

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Run backend tests
echo "Running backend tests..."
cd backend || handle_error "Backend directory not found"
npm test || handle_error "Backend tests failed"

# Run frontend tests
echo "Running frontend tests..."
cd ../frontend || handle_error "Frontend directory not found"
npm test || handle_error "Frontend tests failed"

echo "All tests passed successfully!"
