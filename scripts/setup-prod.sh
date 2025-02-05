#!/bin/bash

echo "Setting up production environment..."

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Check if PM2 is installed
if ! command -v pm2 >/dev/null 2>&1; then
    echo "Installing PM2..."
    npm install -g pm2 || handle_error "Failed to install PM2"
fi

# Check if nginx is installed
if ! command -v nginx >/dev/null 2>&1; then
    echo "Installing nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx || handle_error "Failed to install nginx"
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install --production || handle_error "Failed to install backend dependencies"

# Install frontend dependencies and build
echo "Building frontend..."
cd ../frontend
npm install || handle_error "Failed to install frontend dependencies"
npm run build || handle_error "Failed to build frontend"

# Copy frontend build to nginx directory
echo "Configuring nginx..."
sudo cp -r build/* /var/www/html/ || handle_error "Failed to copy frontend build"

# Configure nginx
sudo tee /etc/nginx/sites-available/battle-arena << EOF
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/battle-arena /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t || handle_error "Invalid nginx configuration"

# Start backend with PM2
cd ../backend
pm2 start src/index.js --name battle-arena-backend || handle_error "Failed to start backend"

# Restart nginx
sudo systemctl restart nginx || handle_error "Failed to restart nginx"

echo "Production environment setup completed!"
echo "Please ensure you have set up your domain DNS to point to this server"
echo "and configured SSL certificates using certbot or similar tool."
