#!/bin/bash

echo "Setting up database..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Check MongoDB installation
if ! command_exists mongod; then
    echo "MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Check Redis installation
if ! command_exists redis-server; then
    echo "Redis is not installed. Please install Redis first."
    exit 1
fi

# Create MongoDB data directory if it doesn't exist
sudo mkdir -p /data/db || handle_error "Failed to create MongoDB data directory"
sudo chown -R $USER /data/db || handle_error "Failed to set MongoDB directory permissions"

# Create Redis data directory if it doesn't exist
sudo mkdir -p /var/lib/redis || handle_error "Failed to create Redis data directory"
sudo chown -R redis:redis /var/lib/redis || handle_error "Failed to set Redis directory permissions"

# Create log directories
sudo mkdir -p /var/log/mongodb || handle_error "Failed to create MongoDB log directory"
sudo chown -R $USER /var/log/mongodb || handle_error "Failed to set MongoDB log directory permissions"

# Start MongoDB
echo "Starting MongoDB..."
mongod --fork --logpath /var/log/mongodb/mongod.log || handle_error "Failed to start MongoDB"

# Start Redis
echo "Starting Redis..."
redis-server --daemonize yes || handle_error "Failed to start Redis"

# Wait for services to start
sleep 5

# Run database seed script
echo "Seeding database..."
cd ../backend || handle_error "Backend directory not found"
npm run seed || handle_error "Failed to seed database"

echo "Database setup completed successfully!"
